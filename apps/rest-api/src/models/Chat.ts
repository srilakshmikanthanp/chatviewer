// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../database";

// Model Class for Chat manipulation
class Chat extends Model<InferAttributes<Chat>, InferCreationAttributes<Chat>> {
  declare chatId: CreationOptional<number>;
  declare userId: CreationOptional<number>;
  declare data: Buffer;
  declare mimeType: string;
  declare createdAt: CreationOptional<Date>;
}

// Initialize the Chat model
Chat.init({
  chatId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  data: {
    type: DataTypes.BLOB,
    allowNull: false
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize: sequelize,
  timestamps: true,
  createdAt: true,
  updatedAt: false,
});

// export the Chat model
export default Chat;
