const { curatedList } = require("../models");

const createCuratedList = async (req, res) => {
	try {
		const { name, description, slug } = req.body;
		if (!name || !description || !slug) {
			return res
				.status(400)
				.json({ error: "All fields are required curatedList" });
		}

		await curatedList.create({
			name,
			description,
			slug,
		});
		return res
			.status(201)
			.json({ message: "Curated list created successfully" });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Unable to create curated list", error: error.message });
	}
};

module.exports = { createCuratedList };
