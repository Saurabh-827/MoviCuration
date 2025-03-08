const { movie } = require("../models");
const axiosInstance = require("../lib/axios.lib");
const { getActors } = require("../controllers/searchMovie");
// const { Op } = require("sequelize");
const searchMovieByGenreAndActor = async (req, res) => {
	try {
		const { genre, actor } = req.query;
		if (!genre && !actor) {
			return res.status(400).json({ message: "Genre and actor are required." });
		}
		let genreId = null;
		let actorId = null;

		// Fetch genre ID if genre is provided
		if (genre) {
			const genreResponse = await axiosInstance.get("/genre/movie/list");
			const genreData = genreResponse.data.genres;
			const matchedGenre = genreData.find(
				(g) => g.name.toLowerCase() === genre.toLowerCase()
			);

			if (!matchedGenre) {
				return res.status(404).json({ message: "Genre not found." });
			}
			genreId = matchedGenre.id;
		}

		// Fetch actor ID if actor is provided
		if (actor) {
			const actorResponse = await axiosInstance.get("/search/person", {
				params: { query: actor },
			});
			if (!actorResponse.data.results.length) {
				return res.status(404).json({ message: "Actor not found." });
			}
			actorId = actorResponse.data.results[0].id;
		}

		// Build API params dynamically
		const params = {};
		if (genreId) params.with_genres = genreId;
		if (actorId) params.with_cast = actorId;

		// Fetch movies based on genre and/or actor
		const response = await axiosInstance.get("/discover/movie", { params });

		if (response.data.results.length === 0) {
			return res.status(404).json({ message: "No movies found" });
		}

		// Format the response
		const movies = response.data.results.map((movie) => ({
			title: movie.title,
			tmdbId: movie.id,
			genre: genreId ? genre : "N/A",
			actors: [],
			releaseYear: movie.release_date
				? movie.release_date.split("-")[0]
				: "N/A",
			rating: movie.vote_average,
			description: movie.overview,
		}));

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

		// Fetch actors for each movie
		for (let movie of movies) {
			movie.actors = await getActors(movie.tmdbId);
		}

		return res.status(200).json(movies);
	} catch (error) {
		return res.status(500).json({
			message: "Unable to search movie by genre and actor.",
			error: error.message,
		});
	}
};
module.exports = { searchMovieByGenreAndActor };
