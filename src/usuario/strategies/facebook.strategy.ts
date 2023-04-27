import { PassportStrategy } from "@nestjs/passport";
import { UsuarioService } from "../usuario.service";
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook'){
    constructor(private usuarioServicio: UsuarioService){
        super(
            {
                clientID:process.env.APP_ID,
                clientSecret:process.env.APP_SECRET,
                callbackURL:'http://20.239.195.88:3000/usr/facebook/callback',
                profileFields: ['name','email','birthday'],
                scope: ['email','birthday']
            }
        )
    }

    /** La funcion validate recibe cuatro parametros, un token de acceso,
     * un token que puede ser usado sin ser redirigido a facebook, 
     * un objeto profile donde viene la información del usuario
      y una funcion callback llamada done */
    async validate (accessToken:string, refreshToken:string, profile:any, done:VerifyCallback) {
        const usuario = await this.usuarioServicio.encontrarOCrear(profile);
        return done(null, usuario);

    }
        
    

}