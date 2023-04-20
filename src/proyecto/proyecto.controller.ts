
import { Body, Controller, Post, Get, Put, Res, Delete} from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { Proyecto } from './schema/proyecto.schema';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as jszip from 'jszip';
import { Response } from 'express';

@Controller('proyecto')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService, private readonly usuarioServicio: UsuarioService) {}

  //Ruta para crear un nuevo proyecto
  @Post('crear')
  async crearNuevoProyecto(@Body() body:{token:string, nombre:string}):Promise<Proyecto>{
    return this.proyectoService.crearProyecto(body.token, body.nombre)
  }

  //lista todos los proyectos del usuario
  @Get('listar')
  async listar(@Body() body:{token:string}):Promise<Proyecto[]>{
    const usuario = await this.usuarioServicio.obtenerIDporToken(body.token);
    return this.proyectoService.listarProyectos(usuario);
  }

  //agregar un colaborador al proyecto
  @Put('colab')
  async agregarColaborador(@Body() body:{pro_id:string, email:string}):Promise<void> {
    const proyecto = this.proyectoService.agregarColaborador(body.pro_id, body.email);
  }

  @Put('actualizar')
  async actualizarRaiz(@Body() body:{pro_id:string,nuevaRaiz:{html:string, css:string, js:string} }):Promise<Proyecto> {
    this.proyectoService.actualizarRaiz(body.pro_id, body.nuevaRaiz);
    return this.proyectoService.obtenerProyectoId(body.pro_id);
  }

  @Delete('borrar')
  async borrarProyecto(@Body() body:{pro_id:string}) {
    this.proyectoService.borrarProyecto(body.pro_id);
  }
  
  @Get('descargar')
  async descargarProyecto(@Body() pro_id:string, @Res() res: Response ) {
      const zip = new jszip();

      const raiz = await this.proyectoService.obtenerRaiz(pro_id);


      zip.file('index.html',raiz.html);
      zip.file('styles.css',raiz.css);
      zip.file('script.js',raiz.js);

      const contenido = await zip.generateAsync({type:'nodebuffer'});

      res.set({
        'Content-type':'application/zip',
        'Content-Disposition':'attachment=files.zip'
      });

      res.send(contenido);
  }


  @Get('raiz')
  async obtenerRaiz(@Body() body:{pro_id:string}):Promise<Object> {
     const res = this.proyectoService.obtenerRaiz(body.pro_id);
     return (await res).html;
  }


}
