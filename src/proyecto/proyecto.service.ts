import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Proyecto } from './schema/proyecto.schema';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class ProyectoService {

    date = new Date();

    constructor(
       @InjectModel(Proyecto.name) private proyectoModelo: mongoose.Model<Proyecto>,
       private servicioUsuario: UsuarioService
    ){}

    // funcion para crear un royecto
    async crearProyecto (identificador: string, token:{token:string}) : Promise<Proyecto> {
        const proyecto = await this.proyectoModelo.create({
            'identificador': identificador, 'f_crea': this.date.getDate(), 'u_mod':this.date.getDate(),
            'colaboradores': [],
            'creador':this.servicioUsuario.obtenerIDtoken(token),
            'raiz': {}
        })
        return proyecto;
    } 

    //funcion que retorna todos los proyectos de un usuario
    async listarProyectosUsuario(token:{token:string}): Promise<Array<Proyecto>> {
        let id_usuario = this.servicioUsuario.obtenerIDtoken(token);
        let proyectos: Array<Proyecto>
        proyectos = await this.proyectoModelo.find({creador: new mongoose.Types.ObjectId(await id_usuario)});
        return proyectos;
    }

    //funcion para agregar un colaborador al proyecto
    async agregarColaborador(proyecto_id:mongoose.Types.ObjectId, email_colab:string):Promise<mongoose.mongo.UpdateResult>{
        const colaborador = this.servicioUsuario.existeByEmail(email_colab);
        const proyecto = await this.proyectoModelo.updateOne({_id:proyecto_id},{$push: {colaboradores: colaborador}})
        return proyecto;
    }

    //funcion para agregar archivos html, js y css
    async actualizar(proyecto_id:mongoose.Types.ObjectId, html?:string, css?:string, js?:string):Promise<mongoose.mongo.UpdateResult> {
        const raiz = {
            'html':html,
            'css':css,
            'js':js
        }
        const proyecto = await this.proyectoModelo.updateOne({_id:proyecto_id},{
            u_mod:this.date.getDate(),raiz:raiz
        })
        return proyecto;
    }

   


}
