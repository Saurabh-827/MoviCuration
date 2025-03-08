const axiosInstance = require("../lib/axios.lib.js");

const searchMovie = async (req, res) => {
	try {
		const { query } = req.query;

		if (!query) {
			return res.status(400).json({ error: "A search term is required." });
		}

		const response = await axiosInstance.get("/search/movie", {
			params: {
				query: query,
			},
		});
		if (response.data.results.length === 0) {
			return res.status(404).json({ message: "No movies found" });
		}
		const movies = response.data.results.map((movie) => ({
			title: movie.title,
			tmdbId: movie.id,
			genre: movie.genre_ids.join(",  "),
			actors: [],
			releaseYear: movie.release_date,
			rating: movie.vote_average,
			description: movie.overview,
		}));

		for (let movie of movies) {
			movie.actors = await getActors(movie.tmdbId);
		}

		return res.status(200).json(movies);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Unable to fetch movies", error: error.message });
	}
};
const getActors = async (movieId) => {
	try {
		const response = await axiosInstance.get(`/movie/${movieId}/credits`);
		const cast = response.data.cast || [];
		const actors = cast
			.filter((actor) => actor.known_for_department === "Acting")
			.map((actor) => actor.name);
		return actors;
	} catch (error) {
		console.error("Error fetching actors from TMDB:", error);
		return [];
	}
};
module.exports = { searchMovie, getActors };
