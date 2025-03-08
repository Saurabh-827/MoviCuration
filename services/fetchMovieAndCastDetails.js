const axiosInstance = require("../lib/axios.lib.js");

const fetchMovieAndCastDetails = async (movieId) => {
	try {
		const responseMovie = await axiosInstance.get(`/movie/${movieId}`);
		const responseCast = await axiosInstance.get(`/movie/${movieId}/credits`);

		// Extract the first 5 actors and join their names into a string
		const actors = responseCast.data.cast
			.filter((actor) => actor.known_for_department === "Acting")
			.slice(0, 5)
			.map((actor) => actor.name) // Extract actor names
			.join(", "); // Join names into a single string

		// Extract genres and join them into a string
		const genres = responseMovie.data.genres
			.map((genre) => genre.name)
			.join(", ");

		// Build the movie details object
		const movieDetails = {
			title: responseMovie.data.title,
			tmdbId: responseMovie.data.id,
			genre: genres,
			actors: actors,
			releaseYear: responseMovie.data.release_date
				? responseMovie.data.release_date.split("-")[0] // Correctly access release_date
				: "N/A",
			rating: responseMovie.data.vote_average,
			description: responseMovie.data.overview,
		};
		return movieDetails;
	} catch (error) {
		console.error("Error fetching movie details:", error.message);
		return {};
	}
};

module.exports = { fetchMovieAndCastDetails };
