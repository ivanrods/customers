import Sequelize, { Model } from "sequelize";

class File extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                path: Sequelize.STRING,
           
            },
            {
                sequelize,
                name: {
                    singular: "file",
                    plural: "files",
                },
                tableName: "file",
            },
        );
    }

    static associate(models) {
        this.hasMany(models.User, {
            foreignKey: "file_id", 
            as: "files",            
        });
    }
}

export default File;
