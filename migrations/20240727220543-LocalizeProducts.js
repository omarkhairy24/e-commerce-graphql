'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('LocalizedProducts', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      lang: {
        type: Sequelize.ENUM('ar', 'en', 'fr'),
        allowNull: false,
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
      productId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Products',
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

    await queryInterface.addIndex('LocalizedProducts', ['title']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('LocalizedProducts');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_LocalizedProducts_lang";');
  }
};
