const { query } = require("express");
const axiosInstance = require("../lib/axios.lib");
const { searchMovie } = require("../controllers/searchMovie");
const { createCuratedList } = require("../controllers/createCuratedList.js");
const { updateCuratedList } = require("../controllers/updateCuratedList.js");
const { createWatchlist } = require("../controllers/createWatchlist.js");
const { createWishlist } = require("../controllers/createAddWishlist.js");
const {
	addMovieCuratedListItem,
} = require("../controllers/addMovieCuratedListItem.js");
const { createReview } = require("../controllers/createReview.js");
const { sortMovies } = require("../controllers/sortMovies.js");
const {
	searchMovieByGenreAndActor,
} = require("../controllers/searchMovieByGenreAndActor.js");
const { getTop5Movies } = require("../controllers/getTop5Movies.js");
const {
	curatedList,
	movie,
	watchlist,
	wishlist,
	curatedListItem,
	review,
} = require("../models/index.js");
const { movieExistsInDb } = require("../services/movieExistsInDb.js");
const {
	fetchMovieAndCastDetails,
} = require("../services/fetchMovieAndCastDetails.js");

jest.mock("../lib/axios.lib.js", () => ({
	get: jest.fn(),
}));

jest.mock("../models/index.js", () => ({
	curatedList: {
		create: jest.fn(),
		findOne: jest.fn(),
	},
	watchlist: {
		create: jest.fn(),
		findAll: jest.fn(),
	},
	movie: {
		findOne: jest.fn(),
		create: jest.fn(),
		findAll: jest.fn(),
	},
	wishlist: {
		create: jest.fn(),
	},
	curatedListItem: {
		findOne: jest.fn(),
		create: jest.fn(),
	},
	review: {
		create: jest.fn(),
	},
}));
jest.mock("../services/movieExistsInDb.js", () => ({
	movieExistsInDb: jest.fn(),
}));
jest.mock("../services/fetchMovieAndCastDetails.js", () => ({
	fetchMovieAndCastDetails: jest.fn(),
}));

describe("Controllers Tests (Unit Testing)", () => {
	test("should search movies ", async () => {
		const req = {
			query: {
				query: "Inception",
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		const mockResponse = {
			data: {
				results: [
					{
						title: "Inception",
						id: 27205,
						genre_ids: [28, 878, 12],
						release_date: "2010-07-16",
						vote_average: 8.8,
						overview: "A thief who enters dreams.",
					},
				],
			},
		};
		axiosInstance.get.mockResolvedValue(mockResponse);
		await searchMovie(req, res);
		expect(res.json).toHaveBeenCalledWith([
			{
				title: "Inception",
				tmdbId: 27205,
				genre: "28,  878,  12",
				actors: [],
				releaseYear: "2010-07-16",
				rating: 8.8,
				description: "A thief who enters dreams.",
			},
		]);
		expect(axiosInstance.get).toHaveBeenCalledWith("/search/movie", {
			params: { query: "Inception" },
		});
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test("should create curated list", async () => {
		const req = {
			body: {
				name: "Favourite Movies",
				description: "Movies that I love",
				slug: "favourite-movies",
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };

		const mockResponse = { message: "Curated list created successfully" };
		curatedList.create.mockResolvedValue({
			name: "Favourite Movies",
			description: "Movies that I love",
			slug: "favourite-movies",
		});

		await createCuratedList(req, res);
		expect(res.json).toHaveBeenCalledWith(mockResponse);
		expect(res.status).toHaveBeenCalledWith(201);
	});

	test("should update curated list", async () => {
		const req = {
			params: { curatedListId: 1 },
			body: {
				name: "Favourite Movies",
				description: "Movies that I love",
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		curatedList.findOne.mockResolvedValue({
			name: "Favourite Movies",
			description: "Movies that I love",
			save: jest.fn(),
		});
		const mockResponse = { message: "Curated list updated successfully" };
		await updateCuratedList(req, res);

		expect(res.json).toHaveBeenCalledWith(mockResponse);
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test("should add movies to watchlist", async () => {
		const req = {
			body: {
				movieId: 1,
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		movieExistsInDb.mockResolvedValue(false);
		fetchMovieAndCastDetails.mockResolvedValue({
			title: "Inception",
			tmdbId: 27205,
			genre: "28, 878, 12",
			actors: [],
			releaseYear: "2010",
			rating: 8.8,
			description: "A thief who enters dreams.",
		});
		movie.create.mockResolvedValue({
			id: 1,
			title: "Inception",
			tmdbId: 27205,
			genre: "28, 878, 12",
			actors: [],
			releaseYear: "2010",
			rating: 8.8,
			description: "A thief who enters dreams.",
		});
		watchlist.create.mockResolvedValue({ movieId: 1, addedAt: new Date() });
		const mockResponse = { message: "Movie added to watchlist successfully." };
		await createWatchlist(req, res);
		expect(res.json).toHaveBeenCalledWith(mockResponse);
		expect(res.status).toHaveBeenCalledWith(201);
	});

	test("should add movie to wishlist", async () => {
		const req = {
			body: {
				movieId: 1,
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		movieExistsInDb.mockResolvedValue(true);
		wishlist.create.mockResolvedValue({ movieId: 1, addedAt: new Date() });
		const mockResponse = { message: "Movie added to wishlist successfully." };
		await createWishlist(req, res);
		expect(res.json).toHaveBeenCalledWith(mockResponse);
		expect(res.status).toHaveBeenCalledWith(201);
	});

	test("should add movie to curated list item", async () => {
		const req = {
			body: {
				movieId: 1,
				curatedListId: 1,
			},
		};
		curatedListItem.findOne.mockResolvedValue(null);
		movieExistsInDb.mockResolvedValue(false);
		fetchMovieAndCastDetails.mockResolvedValue({
			title: "Inception",
			tmdbId: 27205,
			genre: "28, 878, 12",
			actors: [],
			releaseYear: "2010",
			rating: 8.8,
			description: "A thief who enters dreams.",
		});
		movie.create.mockResolvedValue({
			id: 1,
			title: "Inception",
			tmdbId: 27205,
			genre: "28, 878, 12",
			actors: [],
			releaseYear: "2010",
			rating: 8.8,
			description: "A thief who enters dreams.",
		});
		curatedListItem.create.mockResolvedValue({ movieId: 1, curatedListId: 1 });
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		const mockResponse = {
			message: "Movie added to curated-list  successfully.",
		};
		await addMovieCuratedListItem(req, res);
		expect(res.json).toHaveBeenCalledWith(mockResponse);
		expect(res.status).toHaveBeenCalledWith(201);
	});

	test("should add reviews ", async () => {
		const req = {
			params: { movieId: 1 },
			body: {
				rating: 8.5,
				reviewText: "Great movie",
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		movie.findOne.mockReturnValue(true);
		review.create.mockResolvedValue({
			movieId: 1,
			rating: 8.5,
			reviewText: "Great movie",
		});
		const mockResponse = { message: "Review added successfully." };
		await createReview(req, res);
		expect(res.json).toHaveBeenCalledWith(mockResponse);
		expect(res.status).toHaveBeenCalledWith(201);
	});

	test("should search movie by genre and actor", async () => {
		const req = {
			query: {
				genre: "Action",
				actor: "Leonardo DiCaprio",
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		movie.findAll.mockResolvedValue([
			{
				id: 1,
				title: "Inception",
				tmdbId: 27205,
				genre: "Action",
				actors: "Leonardo DiCaprio",
				releaseYear: "2010-07-16",
				rating: 8.8,
				description: "A thief who enters dreams.",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);

		await searchMovieByGenreAndActor(req, res);
		expect(res.json).toHaveBeenCalledWith({
			movies: [
				{
					id: 1,
					title: "Inception",
					tmdbId: 27205,
					genre: "Action",
					actors: "Leonardo DiCaprio",
					releaseYear: "2010-07-16",
					rating: 8.8,
					description: "A thief who enters dreams.",
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
				},
			],
		});
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test("should sort movies", async () => {
		const req = {
			query: {
				list: "watchlist", // Include the list parameter
				sortBy: "rating",
				order: "desc",
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		watchlist.findAll.mockResolvedValue([
			{
				movie: {
					title: "Inception",
					tmdbId: 27205,
					genre: "Action",
					actors: "Leonardo DiCaprio",
					releaseYear: "2010-07-16",
					rating: 8.8,
				},
			},
		]);
		await sortMovies(req, res);
		expect(res.json).toHaveBeenCalledWith({
			movies: [
				{
					title: "Inception",
					tmdbId: 27205,
					genre: "Action",
					actors: "Leonardo DiCaprio",
					releaseYear: "2010-07-16",
					rating: 8.8,
				},
			],
		});
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test("should get top 5 movies", async () => {
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		const mockResponse = [
			{
				title: "Inception",
				rating: 8.8,
				review: {
					text: "Great movie",
					wordCount: 2,
				},
			},
		];
		const movies = [
			{
				title: "Inception",
				rating: 8.8,
				reviews: [
					{
						reviewText: "Great movie",
					},
				],
			},
		];
		movie.findAll.mockResolvedValue(movies);
		await getTop5Movies({}, res);
		expect(res.json).toHaveBeenCalledWith({ movies: mockResponse });
		expect(res.status).toHaveBeenCalledWith(200);
	});
});

describe("Endpoints testing (integration testing)", () => {
	test("GET /api/movies/search should search movie", async () => {
		const req = {
			query: {
				query: "Inception",
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		const mockResponse = {
			data: {
				results: [
					{
						title: "Inception",
						id: 27205,
						genre_ids: [28, 878, 12],
						release_date: "2010-07-16",
						vote_average: 8.8,
						overview: "A thief who enters dreams.",
					},
				],
			},
		};
		axiosInstance.get.mockResolvedValue(mockResponse);
		await searchMovie(req, res);
		expect(res.json).toHaveBeenCalledWith([
			{
				title: "Inception",
				tmdbId: 27205,
				genre: "28,  878,  12",
				actors: [],
				releaseYear: "2010-07-16",
				rating: 8.8,
				description: "A thief who enters dreams.",
			},
		]);
		expect(axiosInstance.get).toHaveBeenCalledWith("/search/movie", {
			params: { query: "Inception" },
		});
		expect(res.status).toHaveBeenCalledWith(200);
	});
	test("POST /api/curated-lists should create curatedList", async () => {
		const req = {
			body: {
				name: "Favourite Movies",
				description: "Movies that I love",
				slug: "favourite-movies",
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		const mockResponse = { message: "Curated list created successfully" };
		curatedList.create.mockResolvedValue({
			name: "Favourite Movies",
			description: "Movies that I love",
			slug: "favourite-movies",
		});
		await createCuratedList(req, res);
		expect(res.json).toHaveBeenCalledWith(mockResponse);

		expect(res.status).toHaveBeenCalledWith(201);
	});
	test("PUT /api/curated-lists/:curatedListId should update curatedList", async () => {
		const req = {
			params: { curatedListId: 1 },
			body: {
				name: "Favourite Movies",
				description: "Movies that I love",
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		const mockResponse = { message: "Curated list updated successfully" };
		curatedList.findOne.mockResolvedValue({
			name: "Favourite Movies",
			description: "Movies that I love",
			save: jest.fn(),
		});
		await updateCuratedList(req, res);
		expect(res.json).toHaveBeenCalledWith(mockResponse);
		expect(res.status).toHaveBeenCalledWith(200);
	});
	test("POST /api/movies/watchlist should add movies to watchlist", async () => {
		const req = {
			body: {
				movieId: 1,
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		movieExistsInDb.mockResolvedValue(false);
		fetchMovieAndCastDetails.mockResolvedValue({
			title: "Inception",
			tmdbId: 27205,
			genre: "28, 878, 12",
			actors: [],
			releaseYear: "2010",
			rating: 8.8,
			description: "A thief who enters dreams.",
		});
		movie.create.mockResolvedValue({
			id: 1,
			title: "Inception",
			tmdbId: 27205,
			genre: "28, 878, 12",
			actors: [],
			releaseYear: "2010",
			rating: 8.8,
			description: "A thief who enters dreams.",
		});
		watchlist.create.mockResolvedValue({ movieId: 1, addedAt: new Date() });
		const mockResponse = { message: "Movie added to watchlist successfully." };
		await createWatchlist(req, res);
		expect(res.json).toHaveBeenCalledWith(mockResponse);
		expect(res.status).toHaveBeenCalledWith(201);
	});
	test("POST /api/movies/wishlist should add movie to wishlist", async () => {
		const req = {
			body: {
				movieId: 1,
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		movieExistsInDb.mockResolvedValue(true);
		wishlist.create.mockResolvedValue({ movieId: 1, addedAt: new Date() });
		const mockResponse = { message: "Movie added to wishlist successfully." };
		await createWishlist(req, res);
		expect(res.json).toHaveBeenCalledWith(mockResponse);
		expect(res.status).toHaveBeenCalledWith(201);
	});

	test("POST /api/movies/curated-list should add movie to curated list item", async () => {
		const req = {
			body: {
				movieId: 1,
				curatedListId: 1,
			},
		};
		curatedListItem.findOne.mockResolvedValue(null);
		movieExistsInDb.mockResolvedValue(false);
		fetchMovieAndCastDetails.mockResolvedValue({
			title: "Inception",
			tmdbId: 27205,
			genre: "28, 878, 12",
			actors: [],
			releaseYear: "2010",
			rating: 8.8,
			description: "A thief who enters dreams.",
		});
		movie.create.mockResolvedValue({
			id: 1,
			title: "Inception",
			tmdbId: 27205,
			genre: "28, 878, 12",
			actors: [],
			releaseYear: "2010",
			rating: 8.8,
			description: "A thief who enters dreams.",
		});
		curatedListItem.create.mockResolvedValue({ movieId: 1, curatedListId: 1 });
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		const mockResponse = {
			message: "Movie added to curated-list  successfully.",
		};
		await addMovieCuratedListItem(req, res);
		expect(res.json).toHaveBeenCalledWith(mockResponse);
		expect(res.status).toHaveBeenCalledWith(201);
	});

	test("POST /api/movies/:movieId/reviews should add reviews ", async () => {
		const req = {
			params: { movieId: 1 },
			body: {
				rating: 8.5,
				reviewText: "Great movie",
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		movie.findOne.mockReturnValue(true);
		review.create.mockResolvedValue({
			movieId: 1,
			rating: 8.5,
			reviewText: "Great movie",
		});
		const mockResponse = { message: "Review added successfully." };
		await createReview(req, res);
		expect(res.json).toHaveBeenCalledWith(mockResponse);
		expect(res.status).toHaveBeenCalledWith(201);
	});

	test("GET /api/movies/searchByGenreAndActor should search movie by genre and actor", async () => {
		const req = {
			query: {
				genre: "Action",
				actor: "Leonardo DiCaprio",
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		movie.findAll.mockResolvedValue([
			{
				id: 1,
				title: "Inception",
				tmdbId: 27205,
				genre: "Action",
				actors: "Leonardo DiCaprio",
				releaseYear: "2010-07-16",
				rating: 8.8,
				description: "A thief who enters dreams.",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);

		await searchMovieByGenreAndActor(req, res);
		expect(res.json).toHaveBeenCalledWith({
			movies: [
				{
					id: 1,
					title: "Inception",
					tmdbId: 27205,
					genre: "Action",
					actors: "Leonardo DiCaprio",
					releaseYear: "2010-07-16",
					rating: 8.8,
					description: "A thief who enters dreams.",
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
				},
			],
		});
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test("GET /api/movies/sort should sort movies", async () => {
		const req = {
			query: {
				list: "watchlist", // Include the list parameter
				sortBy: "rating",
				order: "desc",
			},
		};
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		watchlist.findAll.mockResolvedValue([
			{
				movie: {
					title: "Inception",
					tmdbId: 27205,
					genre: "Action",
					actors: "Leonardo DiCaprio",
					releaseYear: "2010-07-16",
					rating: 8.8,
				},
			},
		]);
		await sortMovies(req, res);
		expect(res.json).toHaveBeenCalledWith({
			movies: [
				{
					title: "Inception",
					tmdbId: 27205,
					genre: "Action",
					actors: "Leonardo DiCaprio",
					releaseYear: "2010-07-16",
					rating: 8.8,
				},
			],
		});
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test("GET /api/movies/top5 should get top 5 movies", async () => {
		const res = { json: jest.fn(), status: jest.fn(() => res) };
		const mockResponse = [
			{
				title: "Inception",
				rating: 8.8,
				review: {
					text: "Great movie",
					wordCount: 2,
				},
			},
		];
		const movies = [
			{
				title: "Inception",
				rating: 8.8,
				reviews: [
					{
						reviewText: "Great movie",
					},
				],
			},
		];
		movie.findAll.mockResolvedValue(movies);
		await getTop5Movies({}, res);
		expect(res.json).toHaveBeenCalledWith({ movies: mockResponse });
		expect(res.status).toHaveBeenCalledWith(200);
	});
});

