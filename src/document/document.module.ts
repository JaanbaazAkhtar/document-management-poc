import { Module } from '@nestjs/common';
import { DocumentsService } from './document.service';
import { DocumentsController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../user/user.module';
import { UsersService } from '../user/user.service'; 
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, User]),
    UsersModule, // Import UsersModule to use UsersService
    ClientsModule.registerAsync([
      {
        name: 'INGESTION_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'ingestion_queue',
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, UsersService],
})
export class DocumentsModule {}