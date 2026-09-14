// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { sequelize } from "./index";
import "../user/User";

// initialize the database
export default async function db_initializer() {
  // test the database connection
  await sequelize.authenticate();
  await sequelize.sync();
}
