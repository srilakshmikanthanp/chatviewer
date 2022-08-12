// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Sequelize } from 'sequelize';

// create the sqlite database
const sequelize: Sequelize = new Sequelize(process.env.DATABASE_URL, {
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// export the sequelize object
export { sequelize };
