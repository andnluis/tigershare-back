import { Controller, Body, Get, Post, Put} from '@nestjs/common';
import { Proyecto } from './schema/proyecto.schema';
import { ProyectoService } from './proyecto.service';
import mongoose from 'mongoose';

@Controller('proyecto')
export class ProyectoController {

    constructor(private servicioProyecto: ProyectoService){}
    
    @Post('crear')
    async crearProyecto(@Body() identificador:string, token:{token:string}):Promise<Proyecto>{
        return this.servicioProyecto.crearProyecto(identificador, token);
    }

    @Get('listar')
    async listarProyectos(@Body() token:{token:string}):Promise<Proyecto[]>{
        return this.servicioProyecto.listarProyectosUsuario(token);
    }

    @Put('colab')
    async agregarColaborador(@Body() id:mongoose.Types.ObjectId, email:string):Promise<mongoose.mongo.UpdateResult> {
        return this.servicioProyecto.agregarColaborador(id,email);
    }

    @Put('actualizar')
    async actualizar(@Body() id:mongoose.Types.ObjectId, html?:string, css?:string, js?:string):Promise<mongoose.mongo.UpdateResult>{
        return this.servicioProyecto.actualizar(id, html, css, js);
    }
}