import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Roles } from './entity/Roles';

@Injectable()
export class AppService {
  constructor(private _connection: Connection) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getStatics() {
    const roles = await this._connection
      .getRepository(Roles)
      .createQueryBuilder('roles')
      .where('roles.active = 1')
      .getMany();
    return {
      roles,
    };
  }
}
