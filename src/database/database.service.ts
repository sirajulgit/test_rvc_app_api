import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaMariaDb({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'testdb',
    });

    super({
      adapter: adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅🛢️ Database connected successfully');
    } catch (error) {
      console.error('❌🛢️ Database connection failed', error);
    }
  }

  async enableShutdownHooks() {
    try {
      await this.$disconnect();
      console.log('✅🛢️ Database disconnected successfully on shutdown');
    } catch (error) {
      console.error('❌🛢️ Database disconnection failed on shutdown', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      console.log('✅🛢️ Database disconnected successfully on destroy');
    } catch (error) {
      console.error('❌🛢️ Database disconnection failed on destroy', error);
    }
  }
}
