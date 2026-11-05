const express = require('express');
const {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee
} = require('../controllers/employeeController');
const {
  employeeRules,
  validateEmployee,
  validateEmployeeBody
} = require('../middleware/employeeValidation');
const { query, validationResult } = require('express-validator');

const router = express.Router();
const objectIdPattern = /^[a-f\d]{24}$/i;

const validateEmployeeId = (req, res, next) => {
  if (!objectIdPattern.test(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employee ID'
    });
  }

  return next();
};

const validatePagination = [
  query('search')
    .optional()
    .isString().withMessage('Search must be a string')
    .trim(),
  query('department')
    .optional()
    .isString().withMessage('Department must be a string')
    .trim(),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1 }).withMessage('Limit must be a positive integer')
    .toInt(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    return next();
  }
];

router.route('/')
  .post(validateEmployeeBody, employeeRules, validateEmployee, createEmployee)
  .get(validatePagination, getEmployees);

router.route('/:id')
  .get(validateEmployeeId, getEmployeeById)
  .put(
    validateEmployeeId,
    validateEmployeeBody,
    employeeRules,
    validateEmployee,
    updateEmployee
  )
  .delete(validateEmployeeId, deleteEmployee);

module.exports = router;
