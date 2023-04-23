import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-facebook';
import { UsuarioService } from "../usuario.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private readonly usuarioServicio: UsuarioService) {
        super({
            clientID: '1807664002953602',
            clientSecret: 'fc22a24f690145f9ba9e0bdb278b3854',
            callbackURL: 'http:localhost:4200/auth/facebook/callback',
            profileFields: ['id','displayName','email','birthday']
        });
    }
}