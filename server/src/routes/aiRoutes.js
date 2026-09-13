const express = require('express');
const router = express.Router();
const { summarizeVisitReason } = require('../controllers/aiController');

router.post('/summarize', summarizeVisitReason);

module.exports = router;
