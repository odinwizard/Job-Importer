const JobService = require("../services/jobServices");
const Job = require("../models/Job.Model");

const importJobs = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const importLog = await JobService.processJobFeed(url);
    return res.status(200).json({
      message: 'Job import started',
      importLogId: importLog._id
    });
  } catch (error) {
    console.error('Error in importJobs:', error);
    res.status(500).json({ error: error.message });
  }
};

const getImportHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await JobService.getImportHistory(parseInt(page), parseInt(limit));
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getImportHistory:', error);
    res.status(500).json({ error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments()
    ]);

    return res.status(200).json({
      jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error in getJobs:', error);
    res.status(500).json({ error: error.message });
  }
};

// Export all as named functions
module.exports = {
  importJobs,
  getImportHistory,
  getJobs
};
