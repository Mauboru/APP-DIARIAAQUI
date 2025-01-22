import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/mysql";

export class Client extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "clients",
  }
);
