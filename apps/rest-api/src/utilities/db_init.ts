// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { sequelize } from "../database";

// initialize the database
export default async function db_initializer() {
  // test the database connection
  await sequelize.authenticate();

  // sync the database
  await sequelize.sync();
}
