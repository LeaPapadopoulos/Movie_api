const bodyParser = require("body-parser");
const express = require("express");
const { check, validationResult } = require("express-validator");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Models = require("./models.js");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //bodyParser middle ware function

const bcrypt = require("bcrypt");

const cors = require("cors");
app.use(cors());

let auth = require("./auth")(app);

const passport = require("passport");
require("./passport");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan("common"));

/**
 * Home route
 * @name GET /
 * @function
 * @memberof module:index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get("/", (req, res) => {
  res.send("Welcome to my Movie Club!");
});

/**
 * @description Get all movies
 * @name GET /movies
 * @function
 * @example
 * // Request data format
 * none
 * @example
 * // Response data format
 * [
 *   {
 *     "Title": "",
 *     "Description": "",
 *       "Genre": {
 *       "Name": "",
 *       "Description": "",
 *     },
 *     "Director": {
 *       "Name": "",
 *       "Bio": "",
 *     },
 *     "Actors": [""],
 *     "ImagePath": "",
 *     "Featured": Boolean,
 *   }
 * ]
 * @param {authentication} - Bearen token (JWT)
 */
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

/**
 * Get a movie by title
 * @name GET /movies/:Title
 * @function
 * @memberof module:index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Movie object
 * // Response data format
 * [
 *   {
 *     "Genre": {
 *       "Name": ""
 *   },
 *  "Director": {
 *        "Name": ""
 *    },
 *    "Actors": [],
 *    "_id": "",
 *    "Title": "",
 *    "Description": "",
 *    "ImagePath": "",
 *   "Featured": Boolean
 *   }
 * ]
 * @throws {Error} If there is an error while retrieving the movie
 */
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

/**
 * Get movies by genre
 * @name GET /movies/genre/:Name
 * @function
 * @memberof module:index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Movie object
 * @throws {Error} If there is an error while retrieving the movie
 */
app.get(
  "/movies/genre/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

/**
 * Get movies by genre
 * @name GET /movies/genre/:Name
 * @function
 * @memberof module:index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Movie object
 * @throws {Error} If there is an error while retrieving the movie
 */
app.get(
  "/movies/director/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

/**
 * Create a new user
 * @name POST /users
 * @function
 * @memberof module:index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Created user object
 * @throws {Error} If there is an error while creating the user
 */
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non-alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            username: req.body.Username,
            password: hashedPassword,
            email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Get all users
 * @name GET /users
 * @function
 * @memberof module:index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object[]} Array of user objects
 * @throws {Error} If there is an error while retrieving the users
 */

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get a user by username
 * @name GET /users/:Username
 * @function
 * @memberof module:index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} User object
 * @throws {Error} If there is an error while retrieving the user
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @description Update a user
 * @name PUT /users/:Username
 * @function
 * @example
 * // Request data format
 * {
 *  "username": "",
 *  "password": "",
 *  "email": "",
 *  "Birthday:" ""
 * }
 * @example
 * // Response data format
 * {
 *  "_id": "",
 *  "username": "",
 *  "password": "",
 *  "email": "",
 *  "Birthday": "",
 *  "FavoriteMovies": []
 * }
 * @param {authentication} - Bearen token (JWT)
 */
app.put(
  "/users/:Username",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non-alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],

  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { username: req.params.Username },
      {
        $set: {
          username: req.body.Username,
          password: hashedPassword,
          email: req.body.Email,
          Birthday: req.body.Birth,
        },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Delete a user
 * @name DELETE /users/:Username
 * @function
 * @memberof module:index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} If there is an error while deleting the user
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Add a movie to a user's favorites
 * @name POST /users/favorites/:Username/:MovieID
 * @function
 * @memberof module:index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} If there is an error while adding the movie to the user's favorites
 */
app.post(
  "/users/favorites/:Username/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { username: req.params.Username },
      {
        $push: { FavoriteMovies: [req.params.MovieID] },
      }
    )
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res
            .status(200)
            .send("Movie with ID " + req.params.MovieID + " was added");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
/**
 * Remove a movie from a user's favorites
 * @name DELETE /users/favorites/:Username/:MovieID
 * @function
 * @memberof module:index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} If there is an error while removing the movie from the user's favorites
 */
app.delete(
  "/users/favorites/:Username/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { username: req.params.Username },
      {
        $pullAll: { FavoriteMovies: [req.params.MovieID] },
      }
    )
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res
            .status(200)
            .send("Movie with ID " + req.params.MovieID + " was deleted");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Documentation route
 * @name GET /documentation
 * @function
 * @memberof module:index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

/**
 * Error handling middleware
 * @name Error Middleware
 * @function
 * @memberof module:index
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
