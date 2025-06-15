"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.addColumn("contact", "status", {
            type: Sequelize.ENUM("ACTIVE", "ARCHIVED"),
            allowNull: false,
            defaultValue: "ACTIVE",
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(async transaction => {
            await queryInterface.removeColumn("contact", "status", {
                transaction,
            });
            await queryInterface.sequelize.query("DROP TYPE enum_contacts_status", {
                transaction,
            });
        });
    },
};
