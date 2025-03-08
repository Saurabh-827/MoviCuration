const { wishlist } = require("../models");
const { movieExistsInDb } = require("../services/movieExistsInDb.js");
const {
	fetchMovieAndCastDetails,
} = require("../services/fetchMovieAndCastDetails.js");
const { movie } = require("../models");
const createWishlist = async (req, res) => {
	try {
		const { movieId } = req.body;
		let movieExists = await movieExistsInDb(movieId);
		if (!movieExists) {
			const movieDetails = await fetchMovieAndCastDetails(movieId);
			if (!movieDetails) {
				return res.status(404).json({ message: "Movie not found" });
			}
			movieExists = await movie.create(movieDetails);
		}
		await wishlist.create({
			movieId: movieExists.id,
			addedAt: new Date(),
		});
		return res
			.status(201)
			.json({ message: "Movie added to wishlist successfully." });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Unable to create wishlist", error: error.message });
	}
};
module.exports = { createWishlist };
