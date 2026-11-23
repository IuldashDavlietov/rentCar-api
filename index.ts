import express from "express";
import { env } from "./src/configs/env";
import { dbConnection } from "./src/configs/dbConnection";
import authentication from "./src/middlewares/authentication";
import errorHandler from "./src/middlewares/errorHandler";
import logger from "./src/middlewares/logger";
import queryHandler from "./src/middlewares/queryHandler";
import router from "./src/routes/index";
// import sync from "./src/helpers/sync";

const app = express();

// Nested Query
app.set("query parser", "extended");

// Configrations:

// Connect to DB:
dbConnection();

// Middlewares:

// Accept JSON:
app.use(express.json());

// Check Authentication:
app.use(authentication);

// Run Logger:
app.use(logger);

// Query Handler
app.use(queryHandler);

// Routes:

// HomePath:
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to RENT A CAR API",
    documents: {
      swagger: "/documents/swagger",
      redoc: "/documents/redoc",
      json: "/documents/json",
    },
    user: req.user,
  });
});

// Routes:
app.use(router);

// not Found
app.all("/*splat", async (req, res) => {
  res.status(404).send({
    error: true,
    message: "Route not available",
  });
});

// errorHandler:
app.use(errorHandler);

// RUN SERVER:
app.listen(env.PORT, env.HOST, () => console.log(`http://${env.HOST}:${env.PORT}`));

// Syncronization (must be in commentLine):
// sync();
