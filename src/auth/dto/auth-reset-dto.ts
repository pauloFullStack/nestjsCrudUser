import { IsJWT, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthResetDTO {
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo.' })
  password: string;

  @IsJWT()
  token: string;
}
