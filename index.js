const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models/index.js");
const { searchMovie } = require("./controllers/searchMovie.js");
const { createCuratedList } = require("./controllers/createCuratedList.js");
const { updateCuratedList } = require("./controllers/updateCuratedList.js");
const { createWatchlist } = require("./controllers/createWatchlist.js");
const { createWishlist } = require("./controllers/createAddWishlist.js");
const {
	addMovieCuratedListItem,
} = require("./controllers/addMovieCuratedListItem.js");
const { createReview } = require("./controllers/createReview.js");
const {
	searchMovieByGenreAndActor,
} = require("./controllers/searchMovieByGenreAndActor.js");
const { sortMovies } = require("./controllers/sortMovies.js");
const { getTop5Movies } = require("./controllers/getTop5Movies.js");

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());

app.get("/api/movies/search", searchMovie);
app.post("/api/curated-lists", createCuratedList);
app.put("/api/curated-lists/:curatedListId", updateCuratedList);
app.post("/api/movies/watchlist", createWatchlist);
app.post("/api/movies/wishlist", createWishlist);
app.post("/api/movies/curated-list", addMovieCuratedListItem);
app.post("/api/movies/:movieId/reviews", createReview);
app.get("/api/movies/searchByGenreAndActor", searchMovieByGenreAndActor);
app.get("/api/movies/sort", sortMovies);
app.get("/api/movies/top5", getTop5Movies);

sequelize
	.authenticate()
	.then(() => console.log("Database connected successfully."))
	.catch((error) => console.error("Unable to connect to database.", error));

app.listen(PORT, () => {
	console.log(`Server is running at port ${PORT}`);
});
