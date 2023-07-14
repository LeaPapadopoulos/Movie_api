const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Models = require("./models.js");
const passportJWT = require("passport-jwt");

let Users = Models.User;
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

/**
 * Local strategy for authenticating users
 * @name LocalStrategy
 * @function
 * @memberof module:passport
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    /**
     * Authenticate user using username and password
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @param {Function} callback - Callback function
     */
    (username, password, callback) => {
      console.log(username + "  " + password);
      Users.findOne({ username: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }

        if (!user) {
          console.log("incorrect username");
          return callback(null, false, {
            message: "Incorrect username.",
          });
        }

        if (!user.validatePassword(password)) {
          console.log("incorrect password");
          return callback(null, false, { message: "Incorrect password." });
        }

        console.log("finished");
        return callback(null, user);
      });
    }
  )
);

/**
 * JWT strategy for authenticating users
 * @name JWTStrategy
 * @function
 * @memberof module:passport
 */
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    /**
     * Authenticate user using JWT token
     * @param {Object} jwtPayload - JWT payload
     * @param {Function} callback - Callback function
     */
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
