'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('SubCategories', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      categoryId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('SubCategories', ['name']);
    await queryInterface.addIndex('SubCategories', ['categoryId']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('SubCategories');
  }
};
