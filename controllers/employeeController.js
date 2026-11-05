const Employee = require('../models/Employee');

const createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    return next(error);
  }
};

const getEmployees = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const filter = {};

    if (req.query.search) {
      const escapedSearch = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.fullName = { $regex: escapedSearch, $options: 'i' };
    }

    if (req.query.department) {
      filter.department = req.query.department;
    }

    const [employees, totalRecords] = await Promise.all([
      Employee.find(filter)
        .sort({ fullName: 1, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Employee.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      data: {
        employees,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalRecords,
          totalPages: Math.ceil(totalRecords / limit)
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee
    });
  } catch (error) {
    return next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const existingEmployee = await Employee.findById(req.params.id);

    if (!existingEmployee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      return next(error);
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    return next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: {}
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee
};
