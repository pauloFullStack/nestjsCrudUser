import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  name: string;

  @IsEmail({}, { message: 'O email é invalido.' })
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 0,
      minLowercase: 0,
      minUppercase: 0,
      minSymbols: 0,
    },
    {
      message: 'Deve conter no minimo 8 caracteres.',
    },
  )
  @IsStrongPassword(
    {
      minLength: 0,
      minNumbers: 0,
      minLowercase: 0,
      minUppercase: 1,
      minSymbols: 0,
    },
    {
      message: 'Deve conter pelo menos uma Letra maiscula.',
    },
  )
  password: string;

  @IsNotEmpty({ message: 'A permissão é obrigatório' })
  @IsEnum(Role)
  role: number;

  iv: string;

  profilePhoto: string;
  telephone: string;
  created: Date;
  updated: Date;
  deleted: Date;
}
