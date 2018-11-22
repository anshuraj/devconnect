const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput (data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';
  data.website = !isEmpty(data.website) ? data.website : '';
  data.youtube = !isEmpty(data.youtube) ? data.youtube : '';
  data.facebook = !isEmpty(data.facebook) ? data.facebook : '';
  data.instagram = !isEmpty(data.instagram) ? data.instagram : '';
  data.linkedin = !isEmpty(data.linkedin) ? data.linkedin : '';
  data.twitter = !isEmpty(data.twitter) ? data.twitter : '';


  if (!Validator.isLength(data.handle, {min: 4, max: 40})) {
    errors.handle = 'Handle length must be atleast 4 characters long';
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Profile handle is required';
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = 'Status is required';
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = 'Not a valid website url'
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = 'Not a valid youtube url'
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = 'Not a valid facebook url'
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = 'Not a valid linkedin url'
    }
  }
  
  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = 'Not a valid twitter url'
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = 'Not a valid instagram url'
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
};