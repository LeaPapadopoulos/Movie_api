# Movie API

This is a backend application with APIs for a Movie database.

# API Documentation

A detailed API documentation avaiable [here] (https://mymovieapp.herokuapp.com/documentation)

## Description

This application provides APIs to manage movies and user information for a movie database. It allows you to perform operations such as retrieving movies, adding users, updating user details, and managing user favorites.

## Installation

1. Clone the repository.
2. Run `npm install` to install the dependencies.

## Dependencies

The following dependencies are required to run the application:

- bcrypt (v5.1.0)
- body-parser (v1.20.1)
- bootstrap (v5.2.3)
- cors (v2.8.5)
- express (v4.18.2)
- express-validator (v6.14.2)
- jsonwebtoken (v9.0.0)
- mongoose (v6.8.2)
- morgan (v1.10.0)
- passport (v0.6.0)
- passport-jwt (v4.0.1)
- passport-local (v1.0.0)
- uuid (v9.0.0)

## Usage

1. Set up a MongoDB database and provide the connection URI in the `CONNECTION_URI` environment variable or uncomment the local MongoDB connection in `index.js`.
2. Start the server by running `npm start` or `node index.js`.
3. The API will be available at `http://localhost:8080`.

## API Endpoints

- `GET /movies` - Retrieve all movies
- `GET /movies/:Title` - Retrieve a movie by title
- `GET /movies/genre/:Name` - Retrieve movies by genre
- `GET /movies/director/:Name` - Retrieve movies by director
- `POST /users` - Create a new user
- `GET /users` - Retrieve all users
- `GET /users/:Username` - Retrieve a user by username
- `PUT /users/:Username` - Update user details
- `DELETE /users/:Username` - Delete a user
- `POST /users/favorites/:Username/:MovieID` - Add a movie to a user's favorites
- `DELETE /users/favorites/:Username/:MovieID` - Remove a movie from a user's favorites
- `GET /documentation` - View API documentation

## Authentication

The API endpoints `/movies/:Title`, `/movies/genre/:Name`, `/movies/director/:Name`, `/users`, `/users/:Username`, `/users/:Username`, `/users/favorites/:Username/:MovieID`, and `/users/favorites/:Username/:MovieID` require authentication using JSON Web Tokens (JWT). Include the JWT in the request header as follows: `Authorization: Bearer <token>`.

## Error Handling

If an error occurs during the API requests, the server will respond with an appropriate error message and status code.

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for more details.
