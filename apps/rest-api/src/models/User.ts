// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {
  DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin, HasManyRemoveAssociationMixin
} from "sequelize";
import { JWT_EXPIRATION_TIME } from "../constants";
import { IJwtAuthPayload } from "../interfaces";
import { sequelize } from "../database";
import * as jwt from "jsonwebtoken";
import Chat from "./Chat";


// Model Class for User manipulation
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // associations
  declare createChat  : HasManyCreateAssociationMixin<Chat>;
  declare getChats    : HasManyGetAssociationsMixin<Chat>;
  declare addChat     : HasManyAddAssociationMixin<Chat, number>;
  declare removeChat  : HasManyRemoveAssociationMixin<Chat, number>;
  declare hasChat     : HasManyHasAssociationMixin<Chat, number>;
  declare countChats  : HasManyCountAssociationsMixin;

  // attributes
  declare userId      : CreationOptional<number>;
  declare name        : string;
  declare email       : string;
  declare createdAt   : CreationOptional<Date>;
  declare updatedAt   : CreationOptional<Date>;

  // methods
  createAuthJwtToken = async (): Promise<string> => {
    // get the secret from the environment variables
    const secret = process.env.JWT_SECRET;

    // create a jwt token payload
    const payload: IJwtAuthPayload = {
      userId: this.userId,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    // return the jwt token
    return jwt.sign(payload, secret, {
      expiresIn: JWT_EXPIRATION_TIME
    });
  }
}

// Initialize the User model
User.init({
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, { sequelize });

// associate the models
User.hasMany(Chat, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "cascade",
  onUpdate: "cascade",
});

// export the User model
export default User;
