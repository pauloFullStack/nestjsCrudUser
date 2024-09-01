import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { ObjectId } from 'mongodb';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(AuthGuard, RoleGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Poder ser usado nos metodos, controllers e de forma global na função bootstrap
  // @UseInterceptors(LogInterceptor)
  // Mas de uma permissão
  // @Roles(Role.Admin, Role.User)
  @Roles(Role.Admin)
  @Post()
  async create(@Body() data: CreateUserDto) {
    return await this.userService.create(data);
  }

  // usando limit de acesso a essa rota, caso quiser usar em todas colocar no controller
  // @UseGuards(ThrottlerGuard)
  @Roles(Role.Admin, Role.User)
  @Get('all')
  async findAll() {
    return await this.userService.findAll();
  }

  // exemplo de ignorar a rota do ThrottlerGuard, so decorar com 'SkipThrottle'
  // @SkipThrottle()
  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id') id: ObjectId) {
    return await this.userService.findOne(id);
  }

  // se eu quiser especificar diretamente no decorador o limite de acesso a rota usar o Throttle, ver como usa na documentação
  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Param('id') id: ObjectId, @Body() data: UpdatePatchUserDto) {
    return await this.userService.update(id, data);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@ParamId() id: ObjectId) {
    return await this.userService.remove(id);
  }

  // Exemplo de como converte para numero os ids numericos por exemplo que vem na urlI
  // @Delete(':id')
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   return {
  //     id,
  //   };
  // }
}
