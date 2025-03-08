module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("curatedLists", {
			id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
			name: { type: Sequelize.STRING, allowNull: false },
			slug: { type: Sequelize.STRING, allowNull: false },
			description: { type: Sequelize.STRING },
			createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
			updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
		});
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable("curatedLists");
	},
};
