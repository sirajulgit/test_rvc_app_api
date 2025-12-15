import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupAuthDto } from './dto/signup-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  // -------------------------------------------
  // Authentication Methods
  // -------------------------------------------

  async signup(signupAuthDto: SignupAuthDto) {
    const existingUser = await this.findOne({ email: signupAuthDto.email });
    if (existingUser) {
      throw new HttpException('User with this email already exists', 400);
    }

    const user = await this.create(signupAuthDto);

    const token = this.jwtService.sign({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: token,
    };
  }

  async login(authUser: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = await this.findOne({ id: authUser.id });

    const token = this.jwtService.sign({
      id: user?.id,
      name: user?.name,
      email: user?.email,
    });

    return {
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
      },
      token: token,
    };
  }

  //########### | Validate user credentials for local strategy | ##############
  async validateUser(email: string, password: string) {
    const user = await this.findOne({ email: email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  // -------------------------------------------
  // CRUD Operations
  // -------------------------------------------
  async create(createAuthDto: CreateAuthDto) {
    if (createAuthDto.password) {
      const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
      createAuthDto.raw_password = createAuthDto.password;
      createAuthDto.password = hashedPassword;
    }

    const data = await this.prisma.users.create({
      data: createAuthDto,
    });

    return data;
  }

  async findAll(where: Record<string, unknown> = {}) {
    const data = await this.prisma.users.findMany({
      where: where || {},
    });
    return data;
  }

  async findOne(where: Record<string, unknown>) {
    const data = await this.prisma.users.findFirst({
      where: where,
      orderBy: { id: 'asc' },
      omit: {
        password: true,
        raw_password: true,
      },
    });
    return data;
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    if (updateAuthDto.password) {
      const hashedPassword = await bcrypt.hash(updateAuthDto.password, 10);
      updateAuthDto.raw_password = updateAuthDto.password;
      updateAuthDto.password = hashedPassword;
    }

    const data = await this.prisma.users.update({
      where: { id },
      data: updateAuthDto,
    });
    return data;
  }

  async remove(id: number) {
    const data = await this.prisma.users.delete({
      where: { id },
    });
    return data;
  }
}
