// npm modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
// config
const { PORT, MONGODB_URI } = require('./config');
// auth strategies
// routers

// Create an Express application
const app = express();

// Log all requests. Skip logging during testing.
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
  skip: () => process.env.NODE_ENV === 'test'
}));

// Parse incoming request bodies as JSON
app.use(express.json());

// Mount auth strategies

// Mount routers

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Connect to DB and Listen for incoming connections
if (require.main === module) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error('\n === Did you remember to start `mongod`? === \n');
      console.error(err);
    });

  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}


module.exports = app; // Export for testing