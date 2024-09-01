import {
  BadRequestException,
  Body,
  Controller,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login-dto';
import { AuthRegisterDTO } from './dto/auth-register-dto';
import { AuthForgetDTO } from './dto/auth-forget-dto';
import { AuthResetDTO } from './dto/auth-reset-dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { join } from 'path';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return await this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return await this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO, @Req() request: Request) {
    return await this.authService.forget(email, request);
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    return await this.authService.reset(password, token);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user) {
    return { user };
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('profile-photo')
  async profilePhoto(
    @User() user,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /image\/(png|jpeg)/ }),
          // 1 mb
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    const photoName = `photo-${user._id.toString()}.png`;
    const path = join(
      __dirname,
      '..',
      '..',
      'storage',
      'profilePhoto',
      // Nome do arquivo
      photoName,
    );

    try {
      await this.fileService.upload(photo, path);
      await this.authService.setPhotoName(photoName, user._id);
    } catch (error) {
      throw new BadRequestException('Erro ao adicionar imagem.');
    }

    return { success: true };
  }

  // Multipos uploads 1 opção
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('files')
  async files(@User() user, @UploadedFiles() files: Express.Multer.File[]) {
    return { files };
  }

  // Multipos uploads 2 opção, manda varios arquivos com nomes e quantidades diferentes
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'photo',
        maxCount: 1,
      },
      {
        name: 'documents',
        maxCount: 10,
      },
    ]),
  )
  @UseGuards(AuthGuard)
  @Post('files-fields')
  async filesFields(
    @User() user,
    @UploadedFiles()
    files: { photo: Express.Multer.File; documents: Express.Multer.File[] },
  ) {
    return { files };
  }
}
