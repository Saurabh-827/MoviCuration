const { review, movie } = require("../models");
const getTop5Movies = async (req, res) => {
	try {
		const movies = await movie.findAll({
			limit: 5,
			order: [["rating", "DESC"]],
			include: [
				{
					model: review,
					attributes: ["reviewText"], // Fetch only the review text
					limit: 1, // Fetch the first review (modify if needed)
				},
			],
		});
		// Format the responseS
		const formattedMovies = movies.map((movie) => {
			const reviewTexts =
				movie.reviews.length > 0
					? movie.reviews[0].reviewText
					: "No review available";
			const wordCount = reviewTexts.split(" ").length;

			return {
				title: movie.title,
				rating: movie.rating,
				review: {
					text: reviewTexts,
					wordCount: wordCount,
				},
			};
		});

		return res.status(200).json({ movies: formattedMovies });
	} catch (error) {
		return res.status(500).json({
			message: "Error while geting top 5 movies ",
			error: error.message,
		});
	}
};
module.exports = { getTop5Movies };
