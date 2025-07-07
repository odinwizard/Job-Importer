const express = require('express');
const cors = require('cors');

const jobRoute = require("../backend/routes/jobRouter")
const scheduleJobImports = require('./jobs/scheduler');

const app = express();

// Middleware
app.use(cors({
         origin:"http://localhost:3000",
         credentials:true,
}));
app.use(express.json());

// Routes
app.use("/api/v1/jobs", jobRoute);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Initialize
scheduleJobImports();
  




module.exports = app;
