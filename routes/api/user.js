const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Load User model
const User = require('../../model/User');

// Load validator
const validateRegisterInput = require('../../validator/register');
const validateLoginInput = require('../../validator/login');

// @route   GET
// @desc    Test user route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'User works!'}));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const {errors, isValid} = validateRegisterInput(req.body);

  // Validate
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
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

// @route   POST api/user/login
// @desc    Login user / Return JWT
// @access  Public
router.post('/login', (req, res) => {
  const {email, password} = req.body;
  const {errors, isValid} = validateLoginInput(req.body);

  // Validate
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Find user by email
  User.findOne({email})
    .then(user => {
      //Check for user
      if (!user) {
        errors.email = 'User not found'
        return res.status(404).json(errors);
      }

      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user.id,
              name: user.name,
              email: user.email
            };

            // Generate JWT
            jwt.sign(
              payload,
              'secret',
              { expiresIn: 86400 },
              (err, token) => {
                res.json({success: true, token: `Bearer ${token}`});
            });
          } else {
            errors.password = 'Password is incorrect'
            return res.status(400).json(errors);
          }
        });
    })
});

// @route   POST api/user/me
// @desc    Returns the current user
// @access  Private
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);


module.exports = router;