const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const Job = require('../models/Job.Model');
const ImportLog = require('../models/ImportLog.Model');
const jobQueue = require('../queues/jobQueue');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  isArray: (name, jpath, isLeafNode, hasAttributes) => {
    if (['item', 'category'].includes(name)) return true;
    return false;
  }
});

class JobService {
  static async fetchJobsFromAPI(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching jobs from ${url}:`, error.message);
      throw error;
    }
  }

  static parseXMLToJSON(xmlData) {
    try {
      return parser.parse(xmlData);
    } catch (error) {
      console.error('Error parsing XML:', error.message);
      throw error;
    }
  }

  static async processJobFeed(url) {
    const startTime = Date.now();
    const importLog = new ImportLog({
      sourceUrl: url,
      status: 'pending'
    });
    await importLog.save();

    try {
      const xmlData = await this.fetchJobsFromAPI(url);
      const jsonData = this.parseXMLToJSON(xmlData);
      
      let jobs = [];
      if (jsonData.rss && jsonData.rss.channel && jsonData.rss.channel.item) {
        jobs = jsonData.rss.channel.item;
      } else if (jsonData.feed && jsonData.feed.entry) {
        jobs = jsonData.feed.entry;
      }

      // Update total fetched count
      await ImportLog.findByIdAndUpdate(importLog._id, {
        totalFetched: jobs.length
      });

      // Add jobs to queue
      for (const jobData of jobs) {
        const normalizedJob = this.normalizeJobData(jobData, url);
        
        await jobQueue.add({
          jobData: normalizedJob,
          importLogId: importLog._id,
          sourceUrl: url
        });
      }

      // Update import log status
      await ImportLog.findByIdAndUpdate(importLog._id, {
        status: 'completed',
        duration: Date.now() - startTime
      });

      return importLog;
    } catch (error) {
      await ImportLog.findByIdAndUpdate(importLog._id, {
        status: 'failed',
        duration: Date.now() - startTime
      });
      throw error;
    }
  }

static normalizeJobData(jobData, sourceUrl) {
  // Helper to safely extract '#text' or raw string
  const getText = (value) => {
    if (typeof value === 'object' && value !== null) {
      return value['#text'] || '';
    }
    return value || '';
  };

  // Normalize data from different sources
  const isJobicy = sourceUrl.includes('jobicy.com');
  const isHigheredJobs = sourceUrl.includes('higheredjobs.com');

  let normalized = {
    source: isJobicy ? 'Jobicy' : isHigheredJobs ? 'HigherEdJobs' : 'Unknown',
    sourceUrl: sourceUrl
  };

  if (isJobicy) {
    normalized.jobId = getText(jobData.guid) || getText(jobData.link) || jobData.id || '';
    normalized.title = getText(jobData.title);
    normalized.company = getText(jobData.company) || 'Unknown';
    normalized.location = getText(jobData.location) || 'Remote';
    normalized.description = getText(jobData.description);
    normalized.url = getText(jobData.link);
    normalized.postedDate = new Date(getText(jobData.pubDate));
    
    const rawCategories = jobData.category;
    normalized.categories = Array.isArray(rawCategories)
      ? rawCategories.map(c => getText(c)).filter(Boolean)
      : rawCategories ? [getText(rawCategories)].filter(Boolean) : [];

    normalized.jobTypes = jobData.jobType ? [getText(jobData.jobType)] : [];
    normalized.isRemote =
      jobData.remote === 'true' ||
      getText(jobData.location).toLowerCase().includes('remote');

  } else if (isHigheredJobs) {
    normalized.jobId = getText(jobData.guid) || getText(jobData.link) || jobData.id || '';
    normalized.title = getText(jobData.title);
    normalized.company = getText(jobData['a10:author']?.['a10:name']) || 'Unknown';
    normalized.location = getText(jobData.location) || 'Unknown';
    normalized.description = getText(jobData.description) || getText(jobData['a10:content']);
    normalized.url = getText(jobData.link);
    normalized.postedDate = new Date(getText(jobData.pubDate));
  }

  return normalized;
}


  static async getImportHistory(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [importLogs, total] = await Promise.all([
      ImportLog.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      ImportLog.countDocuments()
    ]);

    return {
      importLogs,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }
}

module.exports = JobService;
