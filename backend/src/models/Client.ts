import { Model, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../instances/mysql';

export class Client extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'clients',
    timestamps: true,
  }
);
