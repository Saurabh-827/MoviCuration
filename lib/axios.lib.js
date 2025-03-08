const axios = require("axios");
require("dotenv").config();
const axiosInstance = axios.create({
	baseURL: "https://api.themoviedb.org/3",
	params: {
		api_key: process.env.API_KEY,
	},
});

module.exports = axiosInstance;
