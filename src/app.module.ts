import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [UsuarioModule, ConfigModule.forRoot({envFilePath: '.env', isGlobal: true}), MongooseModule.forRoot(process.env.DB_URI), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
