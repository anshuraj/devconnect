const express = require('express');
const router = express.Router();

// @route   GET
// @desc    Test user route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Post works!'}));

module.exports = router;