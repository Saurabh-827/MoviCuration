const { curatedListItem } = require("../models");
const { movieExistsInDb } = require("../services/movieExistsInDb.js");
const {
	fetchMovieAndCastDetails,
} = require("../services/fetchMovieAndCastDetails.js");
const { movie } = require("../models/index.js");
const addMovieCuratedListItem = async (req, res) => {
	try {
		const { movieId, curatedListId } = req.body;
		if (!movieId || !curatedListId) {
			return res.status(400).json({ message: "Invalid request body" });
		}
		const movieIdExistsInCuratedList = await curatedListItem.findOne({
			where: { movieId: movieId },
		});
		if (movieIdExistsInCuratedList) {
			return res
				.status(400)
				.json({ message: "Movie already exists in curated-list Item " });
		}
		let movieExists = await movieExistsInDb(movieId);
		if (!movieExists) {
			const movieDetails = await fetchMovieAndCastDetails(movieId);
			if (!movieDetails) {
				return res.status(404).json({ message: "Movie not found" });
			}
			movieExists = await movie.create(movieDetails);
		}
		await curatedListItem.create({
			movieId: movieExists.id,
			curatedListId: curatedListId,
		});
		return res
			.status(201)
			.json({ message: "Movie added to curated-list  successfully." });
	} catch (error) {
		return res.status(500).json({
			message: "Unable to add movie in curated-list Item.",
			error: error.message,
		});
	}
};
module.exports = { addMovieCuratedListItem };
