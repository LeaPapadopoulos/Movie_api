const express = require("express");
morgan = require("morgan");
fs = require("fs");
path = require("path");

const app = express();

app.use(morgan("common"));

let topMovies = [
  {
    title: "Amélie",
    director: "Jean-Pierre Jeunet",
  },
  {
    title: "Lord of the Rings",
    director: "Peter Jackson",
  },
  {
    title: "Twilight",
    director: "Stephanie Meyer",
  },
  {
    title: "Forrest Gump ",
    director: "Robert Zemeckis",
  },
  {
    title: " The Matrix ",
    director: "Wachowski",
  },
  {
    title: "Seven ",
    director: "David Fincher",
  },
  {
    title: "Star Wars",
    director: "George Lucas",
  },
  {
    title: "Back to the Future",
    director: "Robert Zemeckis",
  },
  {
    title: "WALL·E",
    director: "Andrew Stanton",
  },
];

// GET requests
app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.get("/movies/:title", (req, res) => {
  res.send(
    "Successful GET request returning data about a single movie by title"
  );
});

app.get("/movies/genre/:title", (req, res) => {
  res.send("Successful GET request return data about a genre by title");
});

app.get("/movies/director/:title", (req, res) => {
  res.send("Successful GET request return data about a director by title");
});

app.post("/users/", (req, res) => {
  res.send("User registered");
});

app.put("/users/:username", (req, res) => {
  res.send("User info updated");
});

app.post("/users/favorites/:username", (req, res) => {
  res.send("movie added to the list of favorites");
});

app.delete("/users/favorites/:username", (req, res) => {
  res.send("movie removed from the list of favorites");
});

app.delete("/users/:username", (req, res) => {
  res.send("Successful deregistration");
});

app.get("/", (req, res) => {
  res.send("Welcome to my movie club!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
