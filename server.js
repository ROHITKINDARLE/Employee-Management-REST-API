require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const Employee = require('./models/Employee');
const errorMiddleware = require('./middleware/errorMiddleware');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/employees', employeeRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const startServer = async () => {
  await connectDB();
  await Employee.init();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('Unable to start the application:', error.message);
  process.exit(1);
});
