const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Getting Post model
const Post = require('../../model/Post');

// Getting Profile modal
const Profile = require('../../model/Profile');

// Validator
const validatePostInput = require('../../validator/post');

// @route   GET
// @desc    Test user route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Post works!'}));

// @route   GET api/posts
// @desc    Get Posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
  .sort({date: -1})
  .then(posts => res.json(posts))
  .catch(err => res.status(404).json({message: 'No posts found'}));
});

// @route   GET api/posts/:id
// @desc    Get Post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
  .then(post => res.json(post))
  .catch(err => res.status(404).json({message: 'Post not found'}));
});


// @route   POST api/posts
// @desc    Create Posts
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));
});

// @route   DELETE api/posts/:id
// @desc    DELETE Post by id
// @access  Protected
router.delete('/:id',passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
  .then(profile => {
    Post.findById(req.params.id)
    .then(post => {
      // Check if the user is owner of post
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized'});
      }

      // Delete the post
      post.remove().then(() => res.json({ success: true }))
      .catch(err => res.status(404).json({ message: 'No post found'}))
    })
  })
});

module.exports = router;