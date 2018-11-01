// npm modules
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const compress = require("compression");
const helmet = require("helmet");
const cors = require("cors");
// config
const { PORT, MONGODB_URI } = require("./config");
// auth strategies
const localStrategy = require("./passport/local");
const jwtStrategy = require("./passport/jwt");

// routers
const notesRouter = require("./routes/notes.router");
const foldersRouter = require("./routes/folders.router");
const tagsRouter = require("./routes/tags.router");
const usersRouter = require("./routes/users.router");
const authRouter = require("./routes/auth.router");

// Create an Express application
const app = express();

// Log all requests. Skip logging during
app.use(
  morgan(process.env.NODE_ENV === "development" ? "dev" : "common", {
    skip: () => process.env.NODE_ENV === "test"
  })
);

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000"
  })
);
app.use(compress());
// Parse request body
app.use(express.json());

// Mount auth strategies
passport.use(localStrategy);
passport.use(jwtStrategy);

// Mount routers
app.use("/api", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/notes", notesRouter);
app.use("/api/folders", foldersRouter);
app.use("/api/tags", tagsRouter);

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
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
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Connect to DB and Listen for incoming connections
if (require.main === module) {
  mongoose
    .connect(
      MONGODB_URI,
      { useNewUrlParser: true }
    )
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error("\n === Did you remember to start `mongod`? === \n");
      console.error(err);
    });

  app
    .listen(PORT, function() {
      console.info(`Server listening on ${this.address().port}`);
    })
    .on("error", err => {
      console.error(err);
    });
}

module.exports = app; // Export for testing
