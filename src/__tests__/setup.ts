import * as mysql from 'mysql2/promise';
import { setupUsers } from './factories/setup-users';
import { setupRoles } from './factories/setup-roles';
import { cleanUsers } from './factories/clean-users';

import { cleanActivities } from './factories/clean-activities';
import { cleanRoles } from './factories/clean-roles';

export default async function setup() {
  const connection = await mysql.createConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
  });

  // level 2
  await cleanActivities(connection);
  await cleanUsers(connection);

  // level 1
  await cleanRoles(connection);

  // static entities

  // level 1
  await setupRoles(connection);

  // level 2
  await setupUsers(connection);
}
