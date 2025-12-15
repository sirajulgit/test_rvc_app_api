import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: DatabaseService) {}

  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  async findAll() {
    const messages = await this.prisma.messages.findMany();
    return messages;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
