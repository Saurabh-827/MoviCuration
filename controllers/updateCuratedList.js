const { curatedList } = require("../models");
const updateCuratedList = async (req, res) => {
	try {
		const { curatedListId } = req.params;
		const { name, description } = req.body;
		if (!name || !description) {
			return res
				.status(400)
				.json({ error: "All fields are required for updating curated list" });
		}

		const updateCuratedList = await curatedList.findOne({
			where: { id: curatedListId },
		});
		if (!updateCuratedList) {
			return res.status(404).json({ message: "Curated list not found" });
		}
		if (name) {
			updateCuratedList.name = name;
		}
		if (description) {
			updateCuratedList.description = description;
		}
		await updateCuratedList.save();
		return res
			.status(200)
			.json({ message: "Curated list updated successfully" });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Unable to update curated list", error: error.message });
	}
};
module.exports = { updateCuratedList };
