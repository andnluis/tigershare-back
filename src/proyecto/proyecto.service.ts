/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Proyecto } from './schema/proyecto.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as mongoose from 'mongoose';

@Injectable()
export class ProyectoService {

    date = new Date();

    //Constructor en el que se instancia el modelo de mongoose
    constructor(@InjectModel(Proyecto.name) private modeloProyecto:mongoose.Model<Proyecto>, private servicioUsuario:UsuarioService){}


    //Funcion para crear un nuevo proyecto
    async crearProyecto(token:string, nombre:string):Promise<Proyecto> {
        const id = await this.servicioUsuario.obtenerIDporToken(token);
        const usuario = await this.servicioUsuario.obtenerPorID(id);
        const proyecto = await this.modeloProyecto.create({
            f_crea:this.date,
            u_mod:this.date,
            colaboradores: [],
            creador: usuario,
            raiz: {html:'',css:'',js:''},
            nombre:nombre
        })
        return proyecto;
    }

    //funcion para obtener un proyecto a partir de su id
    async obtenerProyectoId(id:string):Promise<Proyecto> {
        const oid = new mongoose.mongo.ObjectId(id);
        const proyecto = await this.modeloProyecto.findOne(oid).populate('creador');
        return proyecto;
    }

    //funcion para listar los proyectos que el usuario tenga
    async listarProyectos(id:string): Promise<Proyecto[]> {
        const oid = new mongoose.mongo.ObjectId(id);
        const proyectos = await this.modeloProyecto.find({creador:oid})
        console.log(id)
        console.log(proyectos);
        return proyectos;
    }


    //agregar colaborador
    async agregarColaborador(pro_id:string,email:string):Promise<any> {
        const oid_pro = new mongoose.mongo.ObjectId(pro_id);//ObjectID del proyecto
        const id_usr = await this.servicioUsuario.obtenerIdPorEmail(email);
        const oid_usr = new mongoose.mongo.ObjectId(id_usr);
        const proyecto = this.modeloProyecto.updateOne({_id:oid_pro},{$push:{colaboradores:oid_usr}});
        return proyecto;
    }

    async actualizarRaiz(pro_id:string, nuevaRaiz:{html:string, css:string, js:string}) {
        console.log(nuevaRaiz);
        const raiz = this.modeloProyecto.findByIdAndUpdate(pro_id,{
            $set:{'raiz':nuevaRaiz},u_mod:this.date
        });
        return raiz;
    }

    async borrarProyecto(pro_id:string) {
        await this.modeloProyecto.findByIdAndDelete(pro_id);
    }

    //descargar archivos a zip
    async obtenerRaiz(pro_id:string){
        const proyecto = await this.modeloProyecto.findById(pro_id);
        return proyecto.raiz;
    }

    async obtenerProyectosColaborador(id:string):Promise<Proyecto[]> {
        const oid = new mongoose.mongo.ObjectId(id);
        const proyectos = this.modeloProyecto.find({colaboradores:{$elemMatch:{$eq:oid}}});
        return proyectos;
    }

}