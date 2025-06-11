import Sequelize, { Model } from "sequelize";

class Customers extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                status: Sequelize.ENUM("ACTIVE", "ARCHIVED"),
            },
            {
                sequelize,
            },
        );
    }
    static associate(models) {
        this.hasMany(models.Contact);
    }
}
export default Customers;
