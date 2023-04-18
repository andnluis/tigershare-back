import { Injectable } from '@nestjs/common';
import { Proyecto } from './schema/proyecto.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Usuario } from 'src/usuario/schema/usuario.schema';

@Injectable()
export class ProyectoService {

    date = new Date();

    //Constructor en el que se instancia el modelo de mongoose
    constructor(@InjectModel(Proyecto.name) private modeloProyecto:mongoose.Model<Proyecto>, private servicioUsuario:UsuarioService){}


    //Funcion para crear un nuevo proyecto
    async crearProyecto(id:string, nombre:string):Promise<Proyecto> {
       const usuarioCreador = this.servicioUsuario.obtenerPorID(id);
        const proyecto = await this.modeloProyecto.create({
            f_crea:this.date,
            u_mod:this.date,
            colaboradores: [],
            creador: usuarioCreador,
            raiz: {html:'',css:'',js:''},
            nombre:nombre
        })
        return proyecto;
    }

    //funcion para obtener un proyecto a partir de su id
    async obtenerProyectoId(id:string):Promise<Proyecto> {
        const proyecto = this.modeloProyecto.findOne({_id:id});
        return proyecto;
    }

    //funcion para listar los proyectos que el usuario tenga
    async listarProyectos(usuario:string): Promise<Proyecto[]> {
        const proyectos = this.modeloProyecto.find({_id:usuario})
        return proyectos;
    }


    //agregar colaborador
    async agregarColaborador(email:string):Promise<any> {
        const usuario = this.servicioUsuario.obtenerPorEmail(email);
        const proyecto = this.modeloProyecto.updateOne({email:email},{$push:{colaboradores:usuario}});
        return proyecto;
    }

    //actualizar html
    async actualizarHtml(pro_id:string, html_nuevo:string):Promise<Proyecto> {
        this.modeloProyecto.updateOne({_id:pro_id},{u_mod:this.date, $set: {raiz:{html:html_nuevo}}});
        const proyecto = this.obtenerProyectoId(pro_id);
        return proyecto;
    }
    //actualizar css
    async actualizarCss(pro_id:string, css_nuevo:string):Promise<Proyecto> {
        this.modeloProyecto.updateOne({_id:pro_id},{u_mod:this.date, $set: {raiz:{css:css_nuevo}}});
        const proyecto = this.obtenerProyectoId(pro_id);
        return proyecto;
    }
    //actualizar js
    async actualizarJs(pro_id:string, js_nuevo:string):Promise<Proyecto> {
        this.modeloProyecto.updateOne({_id:pro_id},{u_mod:this.date, $set: {raiz:{js:js_nuevo}}});
        const proyecto = this.obtenerProyectoId(pro_id);
        return proyecto;
    }




}