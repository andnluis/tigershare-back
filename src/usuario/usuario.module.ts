/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './schema/usuario.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';

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
  providers: [UsuarioService, JwtStrategy, FacebookStrategy],
  exports: [JwtStrategy, PassportModule, UsuarioService]
})
export class UsuarioModule {}
