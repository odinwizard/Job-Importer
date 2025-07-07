const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
        jobId: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        location: { 
            type: String 
        },
        description: { 
            type: String 
        },
        url: { 
            type: String 
        },
        postedDate: { 
            type: Date 
        },
        source: { 
            type: String, 
            required: true 
        },
        sourceUrl: { 
            type: String, 
            required: true 
        },
        categories: [{ 
            type: String 
        }],
        jobTypes: [{ 
            type: String 
        }],
        salary: { 
            type: String 
        },
        isRemote: { 
            type: Boolean, 
            default: false },
        metadata: { 
            type: mongoose.Schema.Types.Mixed 
        },
}, {timestamps: true});

module.exports = mongoose.model("Job", JobSchema);
