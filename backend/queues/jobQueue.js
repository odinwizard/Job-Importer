const Queue = require("bull");
const {redisClient} = require("../config/redis");
const Job = require("../models/Job.Model");
const ImportLog = require("../models/ImportLog.Model");

const jobQueue = new Queue("job-import", {
    redis: {
        host: process.env.REDIS_HOST ,
        port: process.env.REDIS_PORT || 6379
    }
});
// const jobQueue = new Queue("job-import", {
//   redis: {
//     host: process.env.REDIS_HOST,
//     port: parseInt(process.env.REDIS_PORT),
//     password: process.env.REDIS_PASSWORD,
//     tls: {} // <-- required for Redis Cloud (TLS encrypted connection)
//   }
// });

// Process jobs with concurrency
jobQueue.process(5, async (job) => {
        const { jobData, importLogId, sourceUrl } = job.data;

        try {
            const existingJob = await Job.findOne({
                                            jobId: jobData.jobId
                                        });
           
            if (existingJob) {
                const updatedJob = await Job.findOneAndUpdate(
                                        { jobId: jobData.jobId },
                                        { $set: jobData },
                                        { new: true }      
                                       );  
                await ImportLog.findByIdAndUpdate(importLogId, {
                    $inc: {
                        updatedJobs: 1,
                        totalImported: 1
                    }
                });
            return { status: "created", job: updatedJob};   
            } else {
                // Create new job
            const newJob = new Job(jobData);
            await newJob.save();
            
            await ImportLog.findByIdAndUpdate(importLogId, {
                $inc: { newJobs: 1, totalImported: 1 }
            });
            
            return { status: 'created', job: newJob };
            }
            
        } catch (error) {
             await ImportLog.findByIdAndUpdate(importLogId, {
                $inc: { failedJobs: 1 },
                $push: { 
                    failures: {
                    jobId: jobData.jobId,
                    reason: error.message
                    }
                }
                });
                throw error;
        }
});

// Handle failed jobs

jobQueue.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err.message);
});

module.exports = jobQueue;





