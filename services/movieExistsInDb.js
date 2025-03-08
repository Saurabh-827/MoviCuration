const { movie } = require("../models");
const movieExistsInDb = async (tmdbId) => {
	const movieExist = await movie.findOne({ where: { tmdbId } });
	return !!movieExist;
};
module.exports = { movieExistsInDb };
