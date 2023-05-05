/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Proyecto } from './schema/proyecto.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as mongoose from 'mongoose';
import { Plan, Usuario } from 'src/usuario/schema/usuario.schema';
import { datosPerfil } from 'src/usuario/dto/datosPerfilDTO';

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
        return proyectos;
    }


    //agregar colaborador
    async agregarColaborador(pro_id:string,email:string):Promise<Boolean> {
        const oid_pro = new mongoose.mongo.ObjectId(pro_id);//ObjectID del proyecto
        const id_usr = await this.servicioUsuario.obtenerIdPorEmail(email);
        if(id_usr){
            const oid_usr = new mongoose.mongo.ObjectId(id_usr);
            this.modeloProyecto.updateOne({_id:oid_pro},{$push:{colaboradores:oid_usr}});
            return true;
        }
        return false;
    }

    async actualizarRaiz(pro_id:string, nuevaRaiz:{html:string, css:string, js:string}) {
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

    async ultimosTresProyectos(id:string):Promise<Proyecto[]> {
        const oid = new mongoose.mongo.ObjectId(id);
        const proyectos = this.modeloProyecto.aggregate([
            {$match: {creador:oid}},
            {$sort: {u_mod:-1}},
            {$limit: 3}
        ]);

        return proyectos;
    }


    async listarColaboradores(pro_id:string) {
        const oid = new mongoose.mongo.ObjectId(pro_id);
        const usuarios = await this.modeloProyecto.find({_id:oid},{_id:0,colaboradores:1});
        return usuarios;
    }

    async eliminarColaborador(pro_id:string, usuario_id:string) {
        const p_oid = new mongoose.mongo.ObjectId(pro_id);
        const u_oiod = new mongoose.mongo.ObjectId(usuario_id);
        const proyecto = await this.modeloProyecto.updateOne({_id:p_oid},
            {$pull: {colaboradores: u_oiod}});
        return proyecto;
    }

    async cantidadProyectos(id:string){
        const oid = new mongoose.mongo.ObjectId(id);
        const cantidad = await this.modeloProyecto.countDocuments({creador:oid});
        return cantidad;
    }


    async puedeCrearProyecto(token:string):Promise<boolean> {
        const payload = await this.servicioUsuario.obtenerPayload(token);
        const cantidad = await this.cantidadProyectos(payload.id);
        if(payload.plan == Plan.ROOKIE){
            return cantidad <= 50 ? true : false;
        } else if (payload.plan == Plan.ALLY) {
            return cantidad <= 30 ? true : false; 
        }else {
            return cantidad <= 15 ? true : false;
        }
    }

    async puedeAgregarColaboradores(token: string, pro_id):Promise<boolean> {
        const payload = await this.servicioUsuario.obtenerPayload(token);
        const oid = new mongoose.mongo.ObjectId(pro_id);
        if(payload.plan == Plan.ROOKIE){
            return false;
        }
        const cantidad = await this.modeloProyecto.aggregate([
            {$match: {
              _id:oid
            }},{
              $project: {
                _id:0,
                cantidad: {$size: "$colaboradores"},
              }
            }  
          ])

        if(payload.plan == Plan.ELITE) {
            return cantidad[0].cantidad <= 10 ? true : false;
        }

        return cantidad[0].cantidad <= 3 ? true : false;


    }

    async datosUsuario(token:string):Promise<datosPerfil>{
        const id = await this.servicioUsuario.obtenerIDporToken(token);
        const respuesta = new datosPerfil;
        const usuario = await this.servicioUsuario.obtenerPorID(id);
        respuesta.nombre = usuario.nombre;
        respuesta.apellido = usuario.apellido;
        respuesta.plan = usuario.plan;
        respuesta.cantPro = await this.cantidadProyectos(id);
        if(usuario.plan == Plan.ELITE){
            respuesta.maxPro = 50;
        }else if (usuario.plan == Plan.ALLY) {
            respuesta.maxPro = 30;
        } else {
            respuesta.maxPro = 15;
        }
        return respuesta;
    }



}