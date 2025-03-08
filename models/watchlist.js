module.exports = (sequelize, DataTypes) => {
	const watchlist = sequelize.define(
		"watchlist",
		{
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
	watchlist.associate = (models) => {
		watchlist.belongsTo(models.movie, { foreignKey: "movieId" });
	};

	return watchlist;
};
