module.exports = (sequelize, DataTypes) => {
	const curatedList = sequelize.define(
		"curatedList",
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			slug: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
			},
			createdAt: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			timestamps: true,
		}
	);

	// Associations
	curatedList.associate = (models) => {
		curatedList.hasMany(models.curatedListItem, {
			foreignKey: "curatedListId",
		});
	};

	return curatedList;
};
