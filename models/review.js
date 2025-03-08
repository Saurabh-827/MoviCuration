module.exports = (sequelize, DataTypes) => {
	const review = sequelize.define(
		"review",
		{
			movieId: {
				type: DataTypes.INTEGER,
				references: { model: "movie", key: "id" },
			},
			rating: {
				type: DataTypes.FLOAT,
			},
			reviewText: {
				type: DataTypes.STRING,
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
	review.associate = (models) => {
		review.belongsTo(models.movie, { foreignKey: "movieId" });
	};

	return review;
};
