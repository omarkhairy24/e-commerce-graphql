'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      lang: {
        type: Sequelize.ENUM('ar', 'en', 'fr'),
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      specification: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
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
      subCategoryId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'SubCategories',
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

    await queryInterface.addIndex('Products', ['title']);
    await queryInterface.addIndex('Products', ['price']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Products_lang";');
  }
};
