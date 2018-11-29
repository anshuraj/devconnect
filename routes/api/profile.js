const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load models
const Profile = require('../../model/Profile');
const User = require('../../model/User');

const validateProfileInput = require('../../validator/profile');
const validateExperienceInput = require('../../validator/experience');
const validateEducationInput = require('../../validator/education');

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const errors = {};

  Profile.findOne({user: req.user.id})
    .then(profile => {
      if (!profile) {
        errors.message = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/all
// @desc    Get all profile
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name'])
    .then(profiles => {
      console.log(profiles)
      if (!profiles) {
        errors.message = 'There are no profiles';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({profile: 'There are no profiles'}));
})

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({handle: req.params.handle})
    .populate('user', ['name'])
    .then(profile => {
      if (!profile) {
        errors.message = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({user: req.params.user_id})
    .populate('user', ['name'])
    .then(profile => {
      if (!profile) {
        errors.message = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({profile: 'There is no profile for this user'}));
});


// @route   POST api/profile
// @desc    Create a user profile
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);
  if (!isValid) {
    return res.status(400).json({"errors": errors});
  }

  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.github) profileFields.githubUserName = req.body.github;

  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(','.trim());
  }

  profileFields.social = {};

  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;


  Profile.findOne({ user: req.user.id })
    .populate('user', ['name'])
    .then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id},
          { $set: profileFields},
          {new: true}
        ).then(profile => res.json(profile));
      } else {
        // Create
        Profile.findOne({ handle: profileFields.handle })
          .then(profile => {
            if (profile) {
              errors.handle = 'Handle already exists!';
              res.status(400).json(errors);
            }

            // Save profile
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          })
      }
    })
});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const {errors, isValid} = validateExperienceInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id})
      .then(profile => {
        const newExp = {title, company, location, from, to, current, description} = req.body;
        
        profile.experience.unshift(newExp);
        profile.save()
          .then(profile => res.json(profile))
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const {errors, isValid} = validateEducationInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id})
      .then(profile => {
        const newEdu = {school, degree, field, from, to, current, description} = req.body;

        profile.education.unshift(newEdu);
        profile.save()
          .then(profile => res.json(profile))
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
});

module.exports = router;