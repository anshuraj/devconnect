const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../../model/User');

// @route   GET
// @desc    Test user route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'User works!'}));

// @route   POST
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if(user) {
        return res.status(400).json({ email: 'Email already exists' });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        });
      }
    })
});

module.exports = router;