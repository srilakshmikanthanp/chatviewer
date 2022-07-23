// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { IJwtPayload } from "../interfaces";
import { sequelize } from "../database";
import * as jwt from "jsonwebtoken";

// Model Class for User manipulation
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // attributes
  declare userId: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  // methods
  createJwtToken = async (): Promise<string> => {
    // get the secret from the environment variables
    const secret = process.env.JWT_SECRET;

    // create a jwt token payload
    const payload: IJwtPayload = {
      userId: this.userId,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    // return the jwt token
    return jwt.sign(payload, secret, { expiresIn: "1h" });
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

// export the User model
export default User;
