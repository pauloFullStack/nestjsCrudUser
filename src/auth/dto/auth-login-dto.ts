import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthLoginDTO {
  @IsNotEmpty({ message: 'O nome é obrigatória.' })
  @IsEmail({}, { message: 'O email é inválido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo.' })
  password: string;
}
