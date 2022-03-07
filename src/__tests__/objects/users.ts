import * as bcrypt from 'bcryptjs';

export const adminUser = {
  id: 1,
  name: 'admin',
  password_hash: bcrypt.hashSync('admin', 8),
  password: 'admin',
  email: 'admin@demo.com',
  role_id: 1,
};
