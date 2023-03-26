import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt} from 'passport-jwt';
import { Usuario } from './schema/usuario.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
    
}