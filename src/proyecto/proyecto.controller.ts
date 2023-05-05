/* eslint-disable prettier/prettier */
import { Body, Param, Controller, Post, Get, Put, Res, Delete, Headers } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { Proyecto } from './schema/proyecto.schema';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as jszip from 'jszip';
import { Response } from 'express';
import { Usuario } from 'src/usuario/schema/usuario.schema';
import { datosPerfil } from 'src/usuario/dto/datosPerfilDTO';

@Controller('proyecto')
export class ProyectoController {
    constructor(private readonly proyectoService: ProyectoService, private readonly usuarioServicio: UsuarioService) { }

    //Ruta para crear un nuevo proyecto
    @Post('crear')
    async crearNuevoProyecto(@Body() body: { token: string, nombre: string }): Promise<Proyecto | {mensaje: string}> {
       if(await this.proyectoService.puedeCrearProyecto(body.token)){
           return this.proyectoService.crearProyecto(body.token, body.nombre)
       }
       return { mensaje: 'Tu plan no te permite crear más proyectos.'}
    }

    @Get('obtener/:pro_id')
    async obtenerProyectoPorId(@Param('pro_id') pro_id: string): Promise<Proyecto> {
        return await this.proyectoService.obtenerProyectoId(pro_id);
    }

    //lista todos los proyectos del usuario
    @Get('listar/:token')
    async listar(@Param('token') token: string): Promise<Proyecto[]> {
        const usuario = await this.usuarioServicio.obtenerIDporToken(token);
        return this.proyectoService.listarProyectos(usuario);
    }

    //agregar un colaborador al proyecto
    @Put('colab')
    async agregarColaborador(@Body() body: { token: string, pro_id: string, email: string }): Promise<Boolean> {
       if(await this.proyectoService.puedeAgregarColaboradores(body.token, body.pro_id)){
           return await this.proyectoService.agregarColaborador(body.pro_id, body.email);
       }
       return false;
    }

    @Put('actualizar/:pro_id')//body: { nuevaRaiz: { html: string, css: string, js: string } }
    async actualizarRaiz(@Param('pro_id') pro_id: string, @Body() nuevaRaiz: { html: string, css: string, js: string }): Promise<Proyecto> {
        this.proyectoService.actualizarRaiz(pro_id, nuevaRaiz);
        return this.proyectoService.obtenerProyectoId(pro_id);
    }

    @Delete('borrar/:pro_id')
    async borrarProyecto(@Param('pro_id') pro_id: string) {
        await this.proyectoService.borrarProyecto(pro_id);
        return { mensaje: 'Proyecto borrado' };
    }

    @Get('descargar/:pro_id')
    async descargarProyecto(@Param('pro_id') pro_id: string, @Res() res: Response) {
        const zip = new jszip();

        const raiz = await this.proyectoService.obtenerRaiz(pro_id);
        
        zip.file('index.html', raiz.html);
        zip.file('styles.css', raiz.css);
        zip.file('script.js', raiz.js);

        const contenido = await zip.generateAsync({ type: 'nodebuffer' });

        res.set({
            'Content-type': 'application/zip',
            'Content-Disposition': 'attachment=files.zip'
        });

        res.send(contenido);
    }


    @Get('raiz')
    async obtenerRaiz(@Body() body: { pro_id: string }): Promise<Object> {
        const res = this.proyectoService.obtenerRaiz(body.pro_id);
        return (await res).html;
    }

    //Obtiene todos los proyectos en los cuales uno ha colaborado
    @Get('encolab/:token')
    async obtenerProyectosColaboracion(@Param('token') token:string) {
        const id = await this.usuarioServicio.obtenerIDporToken(token);
        return this.proyectoService.obtenerProyectosColaborador(id);
    }

    @Get('/top/:token')
    async ultimosTresProyectos(@Param('token') token:string):Promise<Proyecto[]> {
        const id = await this.usuarioServicio.obtenerIDporToken(token);
        const proyectos = await this.proyectoService.ultimosTresProyectos(id);
        return proyectos;
    }

    @Get('/colab/list/:pro_id')
    async listarColaboradores(@Param('pro_id') pro_id:string) {
        const colaboradores = this.proyectoService.listarColaboradores(pro_id);
        return colaboradores;
    }
    
    @Put('colab/eliminar')
    async eliminarColaborador(@Body() body:{pro_id:string, usuario_id:string}) {
        const proyecto = await this.proyectoService.eliminarColaborador(body.pro_id, body.usuario_id);
        return proyecto;
    }

    
    @Get('/datos_usuario/:token')
    async obtenerDatos(@Param('token') token:string): Promise<datosPerfil> {
        return await this.proyectoService.datosUsuario(token);
    }

    
}
