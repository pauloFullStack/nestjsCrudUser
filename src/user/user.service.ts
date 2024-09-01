import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Users } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ObjectId } from 'mongodb';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { encryptPassword } from 'src/utils/password.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const emailExists = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (emailExists) throw new NotFoundException('O email já existe.');

    const crypto = await encryptPassword(createUserDto.password);
    createUserDto.password = crypto.password;
    createUserDto.iv = crypto.iv;

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<Users[]> {
    return await this.userRepository.find();
  }

  async findOne(id: ObjectId): Promise<Users> {
    return await this.existsUser(id, true);
  }

  async update(
    id: ObjectId,
    updateUserDto: UpdatePatchUserDto,
  ): Promise<Users> {
    const currentUser = await this.existsUser(id, true);

    const existingUser = await this.userRepository.findOneBy({
      email: updateUserDto.email,
    });

    if (
      existingUser &&
      existingUser._id.toString() !== currentUser._id.toString()
    ) {
      throw new NotFoundException('Email já cadastrado.');
    }

    await this.userRepository.update(
      { _id: new ObjectId(id) },
      { ...updateUserDto },
    );
    return await this.findOne(id);
  }

  async remove(id: ObjectId): Promise<DeleteResult> {
    await this.existsUser(id);
    return await this.userRepository.delete({ _id: new ObjectId(id) });
  }

  async existsUser(id: ObjectId, returnUser: boolean = false) {
    const user = await this.userRepository.findOneBy({ _id: new ObjectId(id) });
    if (!user) throw new NotFoundException('O usuário não existe.');

    if (returnUser) return user;
  }
}
