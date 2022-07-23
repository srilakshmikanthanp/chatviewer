// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Sequelize } from "sequelize";

// create the sqlite database
const sequelize: Sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
});

// connect to the database
sequelize.authenticate().then(() => {
  console.log("Connected to the database");
});

// export the sequelize object
export default sequelize;
