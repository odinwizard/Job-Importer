const schedule = require('node-schedule');
const JobService = require('../services/jobServices');

const jobFeeds = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
  'https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
  'https://jobicy.com/?feed=job_feed&job_categories=business',
  'https://jobicy.com/?feed=job_feed&job_categories=management',
  'https://www.higheredjobs.com/rss/articleFeed.cfm'
];

function scheduleJobImports() {
  // Run every hour
  // const rule = new schedule.RecurrenceRule();
  // rule.minute = 0; // at the start of each hour
  
  schedule.scheduleJob("0 * * * *", async () => {
    console.log('Running scheduled job imports...');
    try {
      for (const feedUrl of jobFeeds) {
        try {
          await JobService.processJobFeed(feedUrl);
          console.log(`Successfully processed feed: ${feedUrl}`);
        } catch (error) {
          console.error(`Error processing feed ${feedUrl}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error in scheduled job import:', error);
    }
  });
  
  console.log('Scheduled job imports configured to run hourly');
}

module.exports = scheduleJobImports;
