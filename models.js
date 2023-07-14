const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Represents a movie.
 * @class
 */
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

/**
 * Represents a user.
 * @class
 */
let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

/**
 * Hashes the password using bcrypt.
 * @static
 * @function
 * @memberof module:models~User
 * @param {string} password - The password to hash.
 * @returns {string} The hashed password.
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validates the user's password.
 * @method
 * @memberof module:models~User
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * Movie model.
 * @name Movie
 * @memberof module:models
 * @type {mongoose.Model}
 */
let Movie = mongoose.model("Movie", movieSchema);

/**
 * User model.
 * @name User
 * @memberof module:models
 * @type {mongoose.Model}
 */
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
