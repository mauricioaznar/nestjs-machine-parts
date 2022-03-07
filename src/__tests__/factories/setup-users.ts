import { Connection } from 'mysql2/promise';
import { adminUser } from '../objects/users';

export const setupUsers = async (connection: Connection) => {
  await connection.execute(`delete from users where id > 0`);
  await connection.execute(`ALTER TABLE users AUTO_INCREMENT = 1`);
  await insertUser(connection, adminUser);
};

async function insertUser(connection: Connection, user) {
  await connection.execute(`
  INSERT INTO users (id, name, lastname, fullname, email, password, phone, role_id)
    VALUES('${user.id}','','','', '${user.email}', '${user.password_hash}','', '${user.role_id}')
  `);
}
