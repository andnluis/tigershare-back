import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt} from 'passport-jwt';
import { Usuario } from './schema/usuario.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(@InjectModel(Usuario.name)private modeloUsuario: Model<Usuario>){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
  }

  async validate (payload) {
    const { id } = payload;
    const usuario = await this.modeloUsuario.findById(id);

    if (!usuario) {
        throw new UnauthorizedException('Debes de ingresar sesión primero');
    }

    return usuario;
    }
    
}