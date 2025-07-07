
const express = require("express");
const router = express.Router();
const {importJobs,
       getImportHistory,
       getJobs} = require("../controllers/jobController");



router.post('/import', importJobs);
router.get('/history', getImportHistory);
router.get('/getjobs', getJobs);


module.exports = router;
