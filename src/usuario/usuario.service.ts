import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './schema/usuario.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class UsuarioService {
    constructor(@InjectModel(Usuario.name) private usuarioModelo: mongoose.Model<Usuario>){}

    async findAll():Promise<Usuario[]> {
        const usuarios = await this.usuarioModelo.find();
        return usuarios;
    }

    async findOne(email:string, pass:string):Promise<Usuario> {
        const usuario = await this.usuarioModelo.findOne({email:email, pass:pass}).exec();
        return usuario;
    }

    async agregar(bodyUsuario:Usuario): Promise<Usuario> {
        const usuario = await this.usuarioModelo.create(bodyUsuario);
        return usuario;
    }


}
