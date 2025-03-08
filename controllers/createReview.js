const { review, movie } = require("../models");
const createReview = async (req, res) => {
	try {
		const { rating, reviewText } = req.body;
		const { movieId } = req.params;
		if (!rating || !reviewText) {
			return res
				.status(400)
				.json({ message: "Rating and reviewText are required." });
		}
		const movieExist = await movie.findOne({ where: { id: movieId } });
		if (!movieExist) {
			return res.status(404).json({ error: "Movie not found" });
		}

		if (typeof rating !== "number" || rating < 0 || rating > 10) {
			return res
				.status(400)
				.json({ message: "Rating should be a number between 0 and 10." });
		}
		if (reviewText.length > 500) {
			return res
				.status(400)
				.json({ message: "Review text should not exceed 500 characters." });
		}
		await review.create({
			movieId: movieId,
			rating: rating,
			reviewText: reviewText,
		});

		return res.status(201).json({ message: "Review added successfully." });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Unable to create review", error: error.message });
	}
};
module.exports = { createReview };
