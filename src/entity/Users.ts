import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Roles } from './Roles';
import { Activities } from './Activities';
import { BaseCustomEntity } from './helpers/BaseCustomEntity';

@Index('users_email_unique', ['email'], { unique: true })
@Index('users_role_id_foreign', ['roleId'], {})
@Entity('users', { schema: 'monsreal' })
export class Users extends BaseCustomEntity {
  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'lastname', length: 255 })
  lastname: string;

  @Column('varchar', { name: 'fullname', length: 255 })
  fullname: string;

  @Column('varchar', { name: 'phone', length: 255 })
  phone: string;

  @Column('varchar', { name: 'email', unique: true, length: 255 })
  email: string;

  @Column('varchar', { name: 'password', length: 60, select: false })
  password: string;

  @Column('varchar', { name: 'remember_token', nullable: true, length: 100 })
  rememberToken: string | null;

  @Column('int', { name: 'role_id', nullable: true, unsigned: true })
  roleId: number | null;

  @ManyToOne(() => Roles, (roles) => roles.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Roles;

  @OneToMany(() => Activities, (activities) => activities.user)
  activities: Activities[];
}
