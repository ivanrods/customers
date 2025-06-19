import Sequelize, { Model } from "sequelize";

class Contact extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                status: Sequelize.ENUM("ACTIVE", "ARCHIVED"),
            },
            {
                sequelize,
                name: {
                    singular: "contact",
                    plural: "contacts",
                },
                tableName: "contacts", // ✅ garante que o Sequelize use a tabela correta
            },
        );
    }

    static associate(models) {
        this.belongsTo(models.Customer, {
            foreignKey: "customer_id", // ✅ Nome certo após a migration
            as: "customer", // opcional: alias inverso
        });
    }
}

export default Contact;
