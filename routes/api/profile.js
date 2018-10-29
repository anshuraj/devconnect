const express = require('express');
const router = express.Router();

// @route   GET
// @desc    Test user route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Profile works!'}));

module.exports = router;