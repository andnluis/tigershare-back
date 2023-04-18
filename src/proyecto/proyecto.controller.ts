import { Body, Controller, Post, Get, Put} from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { Proyecto } from './schema/proyecto.schema';
import { UsuarioService } from 'src/usuario/usuario.service';

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
  async listar(@Body() token:string):Promise<Proyecto[]>{
    const usuario = await this.usuarioServicio.obtenerIDporToken(token);
    return this.proyectoService.listarProyectos(usuario);
  }


  //agregar un colaborador al proyecto
  @Put('colab')
  async agregarColaborador(@Body() email:string):Promise<void> {
    const proyecto = this.proyectoService.agregarColaborador(email);
  }

  
  //Actualizar codigo html
  @Put('actualizar/html')
  async actualizarHtml(@Body() pro_id:string, html:string):Promise<Proyecto>{
    const proyecto = this.actualizarHtml(pro_id, html);
    return proyecto;
  }
  
  //Actualizar codigo css
  @Put('actualizar/css')
  async actualizarCss(@Body() pro_id:string, css:string):Promise<Proyecto>{
    const proyecto = this.actualizarCss(pro_id, css);
    return proyecto;
  }
  
  //Actualizar codigo js
  @Put('actualizar/js')
  async actualizarJs(@Body() pro_is:string , js:string):Promise<Proyecto>{
    const proyecto = this.actualizarJs(pro_is, js);
    return proyecto;
  }
}
