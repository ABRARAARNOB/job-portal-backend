import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';

@Injectable()
export class UserService 
{
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,){}

    // async getAllUser()
    // {
    //   const users = await this.userRepository.find();

    //   return{
    //     message: "All User",
    //     data: users
    //   }
    // }

    async create(createUserDto: CreateUserDto) {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return {
        message: "User Created Sucessfully",
        data: user
      }
    }

    async findByEmail(email: string) {
      const user =await this.userRepository.findOne({
        where: { email },
      });

      if(!user)
      {
        throw new UserNotFoundException();
      }
      
      return{
        message: "User Found",
        data: user
      }
    }

    async updateProfile(email: string, dto: UpdateUserDto) {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if(!user)
      {
        throw new UserNotFoundException();
      }

      Object.assign(user, dto);
      const updatedUser = await this.userRepository.save(user);

      return{
          message: "User updated successfully",
          data: updatedUser
      }
    }
}
