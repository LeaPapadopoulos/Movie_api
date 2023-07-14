const jwtSecret = "your_jwt_secret"; // This has to be the same key used in the JWTStrategy

const jwt = require("jsonwebtoken");
const passport = require("passport");

require("./passport"); // Your local passport file

/**
 * Generates a JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username, // This is the username you’re encoding in the JWT
    expiresIn: "7d", // This specifies that the token will expire in 7 days
    algorithm: "HS256", // This is the algorithm used to “sign” or encode the values of the JWT
  });
};

/**
 * @description Login route
 * @name POST /login
 * @function
 * @example
 * // Request data format
 * {
 *   "username": "example_username",
 *   "password": "example_password"
 * }
 * @example
 * // Response data format
 * {
 *   "user": {
 *     "_id": "user_id",
 *     "username": "example_username",
 *     "password": "example_password",
 *     "email": "example_email@example.com",
 *     "Birthday": "1990-01-01",
 *     "FavoriteMovies": ["movie_id1", "movie_id2"]
 *   },
 *   "token": "example_token"
 * }
 * @param {authentication} authentication - Basic HTTP authentication (Username, Password)
 * @param {Object} router - Express router object
 */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
