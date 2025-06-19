import Sequelize, { Model } from "sequelize";

class Customer extends Model {
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
                    singular: "customer",
                    plural: "customers",
                },
                tableName: "customers",
            },
        );
    }

    static associate(models) {
        this.hasMany(models.Contact, {
            foreignKey: "customer_id", // ✅ deve bater com o model Contact
            as: "contacts",            // ✅ importante para usar com include
        });
    }
}

export default Customer;
