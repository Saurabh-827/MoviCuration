module.exports = (sequelize, DataTypes) => {
	const wishlist = sequelize.define(
		"wishlist",
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
	wishlist.associate = (models) => {
		wishlist.belongsTo(models.movie, { foreignKey: "movieId" });
	};

	return wishlist;
};
