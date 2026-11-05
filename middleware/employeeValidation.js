const { body, validationResult } = require('express-validator');

const employeeFields = [
  'fullName',
  'email',
  'phoneNumber',
  'department',
  'designation',
  'salary',
  'joiningDate'
];

const validateEmployeeBody = (req, res, next) => {
  if (
    req.body === null ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      success: false,
      message: 'Request body must be a JSON object'
    });
  }

  const unexpectedFields = Object.keys(req.body).filter(
    (field) => !employeeFields.includes(field)
  );

  if (unexpectedFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Unexpected field: ${unexpectedFields[0]}`
    });
  }

  return next();
};

const employeeRules = [
  body('fullName')
    .exists({ values: 'undefined' }).withMessage('Full name is required')
    .bail()
    .isString().withMessage('Full name must be a string')
    .bail()
    .trim()
    .notEmpty().withMessage('Full name cannot be empty'),
  body('email')
    .exists({ values: 'undefined' }).withMessage('Email is required')
    .bail()
    .isString().withMessage('Email must be a string')
    .bail()
    .trim()
    .toLowerCase()
    .isEmail().withMessage('Email must be valid'),
  body('phoneNumber')
    .exists({ values: 'undefined' }).withMessage('Phone number is required')
    .bail()
    .isString().withMessage('Phone number must be a string')
    .bail()
    .trim()
    .custom((value) => /^(?:\+[1-9]\d{9,14}|0?[6-9]\d{9})$/.test(
      value.replace(/[\s()-]/g, '')
    ))
    .withMessage('Phone number must be a valid international or Indian number'),
  body('department')
    .exists({ values: 'undefined' }).withMessage('Department is required')
    .bail()
    .isString().withMessage('Department must be a string')
    .bail()
    .trim()
    .notEmpty().withMessage('Department cannot be empty'),
  body('designation')
    .exists({ values: 'undefined' }).withMessage('Designation is required')
    .bail()
    .isString().withMessage('Designation must be a string')
    .bail()
    .trim()
    .notEmpty().withMessage('Designation cannot be empty'),
  body('salary')
    .exists({ values: 'undefined' }).withMessage('Salary is required')
    .bail()
    .isFloat({ min: 0 }).withMessage('Salary must be a number greater than or equal to 0')
    .toFloat(),
  body('joiningDate')
    .exists({ values: 'undefined' }).withMessage('Joining date is required')
    .bail()
    .isISO8601({ strict: true }).withMessage('Joining date must be a valid date')
];

const validateEmployee = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg }))
    });
  }

  return next();
};

module.exports = {
  employeeRules,
  validateEmployee,
  validateEmployeeBody
};
