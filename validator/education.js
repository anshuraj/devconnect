const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.field = !isEmpty(data.field) ? data.field : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.school)) {
    errors.school = 'School is required';
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Degree is required';
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = 'From date is required';
  }

  if (Validator.isEmpty(data.field)) {
    errors.field = 'Location is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
};