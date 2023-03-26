import { Body, Controller, Get, Post } from '@nestjs/common';
import { Usuario } from './schema/usuario.schema';
import { UsuarioService } from './usuario.service';

@Controller('usr')
export class UsuarioController {
    constructor(private servicioUsuario: UsuarioService){}

    @Get('all')
    async getAllUsers(): Promise<Usuario[]>{
        return this.servicioUsuario.findAll();
    }

    @Post('ingresar')
    async ingresar(@Body() body): Promise<Usuario> {
        return this.servicioUsuario.findOne(body.email, body.pass)
    }

    @Post('registrar')
    async registrarse(@Body() body): Promise<Usuario> {
    }

}
