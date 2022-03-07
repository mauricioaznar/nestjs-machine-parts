import { Connection } from 'mysql2/promise';

export const cleanRoles = async (connection: Connection) => {
  await connection.execute(`delete from roles where id > 0`);
  await connection.execute(`ALTER TABLE roles AUTO_INCREMENT = 1`);
};
