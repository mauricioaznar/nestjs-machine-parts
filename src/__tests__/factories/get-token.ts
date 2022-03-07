import * as request from 'supertest';
import { adminUser } from '../objects/users';
import { INestApplication } from '@nestjs/common';

export async function getAdminToken(app: INestApplication) {
  const response = await request(app.getHttpServer()).post('/auth/login').send({
    password: adminUser.password,
    email: adminUser.email,
  });

  const access_token = response.body.access_token;
  return { Authorization: `Bearer ${access_token}` };
}
