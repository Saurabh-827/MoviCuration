const { watchlist, curatedList, wishlist, movie } = require("../models");

const sortMovies = async (req, res) => {
	try {
		// const { list, sortBy, order = "ASC" } = req.query;

		// // Validate required parameters
		// if (!list || !sortBy) {
		// 	return res.status(400).json({ message: "List and sortBy are required." });
		// }

		// // Validate list type
		// const validLists = ["watchlist", "curatedList", "wishlist"];
		// if (!validLists.includes(list)) {
		// 	return res.status(400).json({ message: "Invalid list type." });
		// }

		// // Validate sortBy type
		// const validSortBy = ["releaseYear", "rating"];
		// if (!validSortBy.includes(sortBy)) {
		// 	return res.status(400).json({ message: "Invalid sortBy type." });
		// }

		// // Validate order type
		// const validOrder = ["ASC", "DESC"];
		// if (!validOrder.includes(order.toUpperCase())) {
		// 	return res.status(400).json({ message: "Invalid order type." });
		// }

		// let movies;

		// // Fetch movies based on the list type
		// switch (list) {
		// 	case "watchlist":
		// 		movies = await watchlist.findAll({
		// 			include: [
		// 				{
		// 					model: movie,
		// 					attributes: [
		// 						"title",
		// 						"tmdbId",
		// 						"genre",
		// 						"actors",
		// 						"releaseYear",
		// 						"rating",
		// 					],
		// 				},
		// 			],
		// 			order: [[movie, sortBy, order.toUpperCase()]], // Corrected order syntax
		// 		});
		// 		break;

		// 	case "wishlist":
		// 		movies = await wishlist.findAll({
		// 			include: [
		// 				{
		// 					model: movie,
		// 					attributes: [
		// 						"title",
		// 						"tmdbId",
		// 						"genre",
		// 						"actors",
		// 						"releaseYear",
		// 						"rating",
		// 					],
		// 				},
		// 			],
		// 			order: [[movie, sortBy, order.toUpperCase()]], // Corrected order syntax
		// 		});
		// 		break;

		// 	case "curatedList":
		// 		movies = await curatedList.findAll({
		// 			include: [
		// 				{
		// 					model: movie,
		// 					attributes: [
		// 						"title",
		// 						"tmdbId",
		// 						"genre",
		// 						"actors",
		// 						"releaseYear",
		// 						"rating",
		// 					],
		// 				},
		// 			],
		// 			order: [[movie, sortBy, order.toUpperCase()]], // Corrected order syntax
		// 		});
		// 		break;

		// 	default:
		// 		return res.status(400).json({ error: "Invalid list type" });
		// }

		// // Filter out entries where the associated movie is null
		// const validMovies = movies.filter((item) => item.movie !== null);

		// // Format the movie details
		// const formattedMovies = validMovies.map((item) => ({
		// 	title: item.movie.title,
		// 	tmdbId: item.movie.tmdbId,
		// 	genre: item.movie.genre,
		// 	actors: item.movie.actors,
		// 	releaseYear: item.movie.releaseYear,
		// 	rating: item.movie.rating,
		// }));

		const { list, sortBy, order = "ASC" } = req.query;

		// Validate input
		if (
			!["watchlist", "curatedlist", "wishlist"].includes(list) ||
			!["releaseYear", "rating"].includes(sortBy) ||
			!["ASC", "DESC"].includes(order.toUpperCase())
		) {
			return res.status(400).json({ message: "Invalid query parameters." });
		}

		let movies;

		// Fetch movies based on list type
		if (list === "watchlist") {
			movies = await watchlist.findAll({
				include: movie,
				order: [[movie, sortBy, order.toUpperCase()]],
			});
		} else if (list === "wishlist") {
			movies = await wishlist.findAll({
				include: movie,
				order: [[movie, sortBy, order.toUpperCase()]],
			});
		} else if (list === "curatedList") {
			movies = await curatedList.findAll({
				include: movie,
				order: [[movie, sortBy, order.toUpperCase()]],
			});
		}

		const movieList = movies.map((item) => item.movie);
		return res.status(200).json(movieList);

		// return res.status(200).json({ movies: formattedMovies });
	} catch (error) {
		console.error("Error sorting movies:", error);
		return res
			.status(500)
			.json({ message: "Unable to sort movies", error: error.message });
	}
};

module.exports = { sortMovies };
