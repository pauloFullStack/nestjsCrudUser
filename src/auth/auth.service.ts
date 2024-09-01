import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Users } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { AuthRegisterDTO } from './dto/auth-register-dto';
import { comparePassword, encryptPassword } from 'src/utils/password.utils';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private readonly issuer: string;
  private readonly audience: string;

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly mailer: MailerService,
  ) {
    this.issuer = 'login';
    this.audience = 'users';
  }

  createToken(user: Users) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
        {
          // quanto tempo ele vai ser valido
          expiresIn: '7 days',
          // expiresIn: '50 seconds',
          subject: user._id.toString(),
          issuer: this.issuer,
          audience: this.audience,
          // esse atributo 'notBefore' serve para falar para o token, que ele vai estar ativo daqui 1hora
          // notBefore: Math.ceil((Date.now() + 1000 * 60 * 60) / 1000),
        },
      ),
    };
  }

  checkToken(token: string, issuer: string = null, audience: string = null) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: issuer ?? this.issuer,
        audience: audience ?? this.audience,
      });

      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!(await comparePassword(user.password, user.iv, password)))
      throw new UnauthorizedException('Email o senha incorretos.');
    return {
      token: this.createToken(user).accessToken,
      name: user.name,
      email: user.email,
      telephone: user.telephone,
      profilePhoto: user.profilePhoto
        ? `storage/profilePhoto/${user.profilePhoto}`
        : '',
    };
  }

  async forget(email: string, request: Request) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new UnauthorizedException('Email está incorreto.');

    const token = this.jwtService.sign(
      {
        id: user._id.toString(),
      },
      {
        expiresIn: '30 minutes',
        subject: user._id.toString(),
        issuer: 'forget',
        audience: this.audience,
      },
    );

    await this.mailer.sendMail({
      subject: 'Recuperação de senha',
      to: user.email,
      template: 'forget',
      context: {
        name: user.name,
        link: `${request.headers['host']}/forget/${token}`,
        label: `${request.headers['host']}/forget/${token}`,
      },
    });

    return true;
  }
  async reset(password: string, token: string) {
    const { id } = this.checkToken(token, 'forget');
    const crypto = await encryptPassword(password);

    await this.userRepository.update(
      { _id: new ObjectId(id) },
      { password: crypto.password, iv: crypto.iv },
    );
    return this.createToken(
      await this.userRepository.findOneBy({ _id: new ObjectId(id) }),
    );
  }

  async register(data: AuthRegisterDTO) {
    const crypto = await encryptPassword(data.password);
    data.password = crypto.password;
    data.iv = crypto.iv;
    const user = this.userRepository.create(data);
    await this.userRepository.save(user);
    return this.createToken(user);
  }

  async setUser(id: string) {
    return await this.userRepository.findOneBy({ _id: new ObjectId(id) });
  }

  async setPhotoName(photoName: string, id: string) {
    await this.userRepository.update(
      { _id: new ObjectId(id) },
      { profilePhoto: photoName },
    );
  }
}
