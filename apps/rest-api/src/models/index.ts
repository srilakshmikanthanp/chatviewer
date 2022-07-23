// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import User from "./User";
import Chat from "./Chat";

// associate the models
User.hasMany(Chat, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "cascade",
  onUpdate: "cascade",
});

// export the models
export { User, Chat };
