import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { LibsModule } from './libs/libs.module';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, ApiModule, LibsModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
