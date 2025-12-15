import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Version('1')
  async signup(@Body() signupAuthDto: SignupAuthDto) {
    const data = await this.authService.signup(signupAuthDto);
    return data;
  }

  @Post('login')
  @Version('1')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request, @Body() loginAuthDto: LoginAuthDto) {
    console.log('|||||||||||||||| Login payload: ', loginAuthDto);
    const data = await this.authService.login(req.user);
    return data;
  }

  @Get()
  @Version('1')
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const data = await this.authService.findAll();
    return data;
  }

  @Get(':id')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const data = await this.authService.findOne({ id: Number(id) });
    return data;
  }

  @Put()
  @Version('1')
  @UseGuards(JwtAuthGuard)
  async update(@Req() req: Request, @Body() updateAuthDto: UpdateAuthDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const data = await this.authService.update(req.user.id, updateAuthDto);
    return data;
  }
}
