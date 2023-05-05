/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './schema/usuario.schema';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { signupDTO } from './dto/signupDTO';
import { JwtService } from '@nestjs/jwt'
import { loginDTO } from './dto/loginDTO';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Proyecto } from 'src/proyecto/schema/proyecto.schema';
import { ProyectoService } from 'src/proyecto/proyecto.service';

@Injectable()
export class UsuarioService {
    constructor(@InjectModel(Usuario.name) private usuarioModelo: mongoose.Model<Usuario>, private jwtService: JwtService,){}

    async findAll():Promise<Usuario[]> {
        const usuarios = await this.usuarioModelo.find();
        return usuarios;
    }

    async findOne(email:string, pass:string):Promise<Usuario> {
        const usuario = await this.usuarioModelo.findOne({email:email, pass:pass}).exec();
        return usuario;
    }

    //Metodo para registrarse (Sign Up)
    async signUp(singupdto : signupDTO): Promise<{token:string}> {
        const {nombre, apellido, user, email, plan, fnac, pass} = singupdto; // Destructuracion del objeto singupDTO
        const hashedPass = await bcrypt.hash(pass,10); //Encriptacion de la contraseña
        const usuario = await this.usuarioModelo.create({ //Registro del usuario en la base de datos con el metodo create del objeto model de mongooose
            nombre, apellido, user, email, plan, fnac, pass: hashedPass,
        });
        //creacion de token de sesion
        const token = this.jwtService.sign({id: usuario._id, plan: usuario.plan})
        return {token}; //devolucion de token
    }

    //Metodo para iniciar sesion (Sign in)
    async signIn (logindto: loginDTO): Promise<{token:string}> {
        const {email, pass} = logindto; // Destructuracion del objeto logindto
        const usuario = await this.usuarioModelo.findOne({email: email}); // Encontrar el usuario al que petenece

        if(!usuario) { //La consulta no devolvio ningun usuario, por lo cual no exite ningun usuario con ese correo
            throw new UnauthorizedException('Correo invalido');
        }
        
        let token;
        
        const passConcuerda = await bcrypt.compare(pass,usuario.pass); // Verifica si las contraseñas son iguales
        if(passConcuerda) {
            token = this.jwtService.sign({id:usuario._id, plan:usuario.plan});
        }else{
            throw new UnauthorizedException('Correo invalido o contraseña invalido');
        }
        
        return { token }; //devolucion de token
        
    }
    
    async encontrarOCrear(profile):Promise<Usuario> {
        const usuario = await this.usuarioModelo.findOne({email:profile.email});

        if (usuario) {
            return usuario;
        }
        const nuevoUsuario = await this.usuarioModelo.create({
            nombre: profile.nombre,
            apellido: profile.apellido,
            user: profile.user,
            email: profile.email,
            plan: 'Rookie'
        })
        return nuevoUsuario;
    }

    async facebookLogin(usuario):Promise<{token:string}> {
        const token = this.jwtService.sign({id:usuario._id})
        return { token };
    }

    async obtenerPorID(id:string):Promise<Usuario> {
        const usuario = await this.usuarioModelo.findById(id);
        return usuario;
    }

    async obtenerPorEmail(email:string):Promise<Usuario> {
        const usuario = await this.usuarioModelo.findOne({email:email});
        return usuario;
    }

    async obtenerIdPorEmail(email:string):Promise<string> {
        const response = await this.usuarioModelo.findOne({email:email},{_id:1});
        return response.id;
    }
    
    async obtenerIDporToken(token:string):Promise<string> {
        const decode = this.jwtService.verify(token);
        return decode.id;
    }

    async obtenerPayload (token:string): Promise<{
        id:string, plan:string, iat:number, exp: number
    }> {
        const payload = this.jwtService.verify(token);
        return payload;
    }
    
    async actualizarDatos(token: string, nombre:string, apellido:string, email: string, plan: string){
        const id = await this.obtenerIDporToken(token);
        const oid = new mongoose.mongo.ObjectId(id); //Object Id del proyecto
        const usuario = this.usuarioModelo.updateOne({_id:oid},
            {
                nombre: nombre,
                apellido: apellido, 
                email: email,
                plan:plan,
            }
            );
            return usuario;
        }

    async cambiarContr(token:string, pass:string):Promise<any> {
        const id = await this.obtenerIDporToken(token);
        const oid = new mongoose.mongo.ObjectId(id);
        const hashedPass = await bcrypt.hash(pass,10); //Encriptacion de la contraseña
        const usuario = await this.usuarioModelo.updateOne({_id:oid},{pass:hashedPass});
        return usuario;
    }

}