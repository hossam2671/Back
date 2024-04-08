require('dotenv').config();

const { MONGODB_URI } = process.env;
const mongoose = require('mongoose');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });

