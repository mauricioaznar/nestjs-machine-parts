import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
} from 'class-validator';

import { IsEntityActiveConstraint } from '../../common/validator/is-entity-active-constraint';
import { Roles } from '../../../entity/Roles';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNumber(
    {},
    {
      message: 'Rol es requerido',
    },
  )
  @Validate(IsEntityActiveConstraint, [Roles])
  roleId: number;
}
