import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthForgetDTO {
  @IsNotEmpty({ message: 'O nome é obrigatória.' })
  @IsEmail({}, { message: 'O email é inválido' })
  email: string;
}
