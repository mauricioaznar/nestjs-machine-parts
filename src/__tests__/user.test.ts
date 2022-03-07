import { INestApplication } from '@nestjs/common';
import { setupApp } from './factories/setup-app';
import * as request from 'supertest';
import { getAdminToken } from './factories/get-token';
import { adminUser } from './objects/users';
import { Connection } from 'mysql2/promise';
import { getMysqlConnection } from './helpers/get-mysql-connection';

describe('Users', () => {
  let app: INestApplication;

  let connection: Connection;

  beforeAll(async () => {
    connection = await getMysqlConnection();
  });

  afterAll(async () => {
    await connection.end();
  });

  beforeEach(async () => {
    app = await setupApp();
  });

  describe('user testing setup', () => {
    test('admin user is an admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${adminUser.id}`)
        .set(await getAdminToken(app));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.roleId).toBe(1);
    });
  });

  describe('get user list', () => {
    test('allows admin to get user list', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set(await getAdminToken(app));

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.status).toBe(200);
    });

    test('forbids if a token is not set', async () => {
      const response = await request(app.getHttpServer()).get('/users');

      expect(response.status).toBe(401);
    });
  });

  describe('register a user', () => {
    const user1Properties = {
      name: 'user name 1',
      lastname: 'lastname 1',
      email: 'registeremail@email.com',
      roleId: 1,
      password: 'passwordasdfadsf',
    };

    it('allows a user to be created by an admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set(await getAdminToken(app))
        .send({
          ...user1Properties,
        });

      expect(response.body.password).toBeUndefined();
      expect(response.body).toHaveProperty('id');
      expect(response.status).toBe(201);
    });

    describe('email validation', () => {
      const user2Properties = {
        name: 'user name 1',
        lastname: 'lastname 1',
        email: 'emailfromusertwo@email.com',
        roleId: 1,
        password: 'passwordasdfas',
      };
      beforeAll(async () => {
        await request(app.getHttpServer())
          .post('/users')
          .set(await getAdminToken(app))
          .send({
            ...user2Properties,
          });
      });

      it('forbids user with same email', async () => {
        const response = await request(app.getHttpServer())
          .post('/users')
          .set(await getAdminToken(app))
          .send({
            ...user2Properties,
          });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('gets user', () => {
    const user1Properties = {
      name: 'user name 1',
      lastname: 'lastname 1',
      email: 'sernajsjsjsjsjm@email.com',
      roleId: 1,
      password: 'passwordasdfas',
    };
    let user1;
    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set(await getAdminToken(app))
        .send({
          ...user1Properties,
        });
      user1 = response.body;
    });

    it('gets user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${user1.id}`)
        .set(await getAdminToken(app));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.roleId).toBe(1);
      expect(response.body.password).toBeUndefined();
    });
  });

  describe('patches user', () => {
    const user1Properties = {
      name: 'user name 1',
      lastname: 'lastname 1',
      email: 'patch2323@email.com',
      roleId: 1,
    };
    const user2Properties = {
      name: 'user name 1',
      lastname: 'lastname 1',
      email: 'patch2@email.com',
      roleId: 1,
      password: 'asdfaasdfaa',
    };
    let user1;
    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set(await getAdminToken(app))
        .send({
          ...user1Properties,
          password: 'somepassasdfa',
        });
      user1 = response.body;
      await request(app.getHttpServer())
        .post('/users')
        .set(await getAdminToken(app))
        .send({
          ...user2Properties,
        });
    });

    it('patches user without password', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${user1.id}`)
        .set(await getAdminToken(app))
        .send({
          ...user1Properties,
          name: 'name',
          email: 'newrandompatch@email.com',
        });
      expect(response.body.name).toEqual('name');
      expect(response.body.email).toEqual('newrandompatch@email.com');
      expect(response.status).toBe(200);
    });

    it('rejects patch for user using same email', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${user1.id}`)
        .set(await getAdminToken(app))
        .send({
          ...user1Properties,
          email: user2Properties.email,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('removes user', () => {
    const user1Properties = {
      name: 'user name 1',
      lastname: 'lastname 1',
      email: 'remove@email.com',
      roleId: 1,
      password: 'somepassasdf',
    };
    let user1;
    const user2Properties = {
      name: 'user name 1',
      lastname: 'lastname 1',
      email: 'remove2@email.com',
      roleId: 1,
      password: 'somepassasdf',
    };
    let user2;
    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set(await getAdminToken(app))
        .send({
          ...user1Properties,
        });
      user1 = response.body;

      const response2 = await request(app.getHttpServer())
        .post('/users')
        .set(await getAdminToken(app))
        .send({
          ...user2Properties,
        });
      user2 = response2.body;
    });

    it('returns not found after removal', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${user1.id}`)
        .set(await getAdminToken(app));

      const getResponse = await request(app.getHttpServer())
        .get(`/users/${user1.id}`)
        .set(await getAdminToken(app));

      expect(getResponse.status).toBe(404);
    });
  });
});
