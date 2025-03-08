module.exports = (sequelize, DataTypes) => {
	const curatedListItem = sequelize.define(
		"curatedListItem",
		{
			curatedListId: {
				type: DataTypes.INTEGER,
				references: { model: "curatedList", key: "id" },
			},
			movieId: {
				type: DataTypes.INTEGER,
				references: { model: "movie", key: "id" },
			},
			addedAt: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			timestamps: true,
		}
	);

	// Associations
	curatedListItem.associate = (models) => {
		curatedListItem.belongsTo(models.curatedList, {
			foreignKey: "curatedListId",
		});
		curatedListItem.belongsTo(models.movie, { foreignKey: "movieId" });
	};

	return curatedListItem;
};
