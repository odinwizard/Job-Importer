const mongoose = require('mongoose');

const ImportLogSchema = new mongoose.Schema({
                sourceUrl: { 
                    type: String, 
                    required: true 
                },
                timestamp: { 
                    type: Date, 
                    default: Date.now,
                    expires: 86400
                },
                totalFetched: { 
                    type: Number, 
                    default: 0 
                },
                totalImported: { 
                    type: Number, 
                    default: 0 
                },
                newJobs: { 
                    type: Number, 
                    default: 0 
                },
                updatedJobs: { 
                    type: Number, 
                    default: 0 
                },
                failedJobs: { 
                    type: Number, 
                    default: 0 
                },
                failures: [{
                    jobId: String,
                    reason: String
                }],
                status: { 
                    type: String, 
                    enum: ['pending', 'completed', 'failed'], 
                    default: 'pending' 
                },
                duration: { 
                    type: Number 
                },
});
module.exports = mongoose.model("ImportLog", ImportLogSchema);
