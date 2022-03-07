import { Inject, Injectable } from '@nestjs/common';
import { Users } from '../../entity/Users';
import { Connection, Repository } from 'typeorm';
import { BaseService } from '../common/service/base-service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService extends BaseService {
  private _usersRepository: Repository<Users>;

  constructor(
    protected _connection: Connection,
    private readonly authService: AuthService,
    @Inject(REQUEST) request: Request,
  ) {
    super(_connection, request);
    this._usersRepository = this._connection.getRepository(Users);
  }

  async create(createUserDto: CreateUserDto) {
    const id = await this._connection.transaction(async (manager) => {
      const { password, ...user } = createUserDto;
      const fullname = `${user.name} ${user.lastname}`;
      const passwordHashed = await this.authService.createPasswordHashed(
        password,
      );
      const createResult = await this.createEntity(
        manager.getRepository(Users),
        { ...user, fullname, password: passwordHashed },
      );
      const createId = createResult.identifiers[0].id;
      return createId;
    });
    return await this.authService.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this._connection.transaction(async (manager) => {
      const { ...user } = updateUserDto;
      const fullname = `${user.name} ${user.lastname}`;
      const inputs: any = { ...user, fullname };
      await this.updateEntity(manager.getRepository(Users), inputs, id);
      // const updatedUser = await this.authService.findOne(id);
    });
    return await this.authService.findOne(id);
  }

  async remove(id: number) {
    const user = await this.authService.findOne(id);
    await this._connection.transaction(async (manager) => {
      // const user = await this.authService.findOne(id);

      return await manager
        .getRepository(Users)
        .createQueryBuilder()
        .update()
        .set({
          active: -1,
        })
        .where('id = :id', { id })
        .execute();
    });
    return user;
  }
}
