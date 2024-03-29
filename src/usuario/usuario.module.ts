/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema } from './schema/usuario.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ProyectoModule } from 'src/proyecto/proyecto.module';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Usuario', schema: UsuarioSchema}]), PassportModule.register({defaultStrategy: 'jwt'}), JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return {
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXPIRES'),
        }
        
      }
    }
  })],
  controllers: [UsuarioController],
  providers: [UsuarioService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, UsuarioService]
})
export class UsuarioModule {}
