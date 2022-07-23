// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../database";

// Model Class for Chat manipulation
class Chat extends Model<InferAttributes<Chat>, InferCreationAttributes<Chat>> {
  declare chatId: CreationOptional<number>;
  declare message: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

// Initialize the Chat model
Chat.init({
  chatId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
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

// export the Chat model
export default Chat;
