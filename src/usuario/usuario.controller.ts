/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Req, Headers, Put } from '@nestjs/common';
import { loginDTO } from './dto/loginDTO';
import { signupDTO } from './dto/signupDTO';
import { Plan, Usuario } from './schema/usuario.schema';
import { UsuarioService } from './usuario.service';
import { AuthGuard } from '@nestjs/passport';
import { ProyectoService } from 'src/proyecto/proyecto.service';

@Controller('usr')
export class UsuarioController {
    constructor(private servicioUsuario: UsuarioService){}

    //Endpoint que retorna todos los usuarios, solo para testear.
    @Get('all')
    async getAllUsers(): Promise<Usuario[]>{
        return this.servicioUsuario.findAll();
    }

    //Endpoint para ingresar sesion 
    @Post('ingresar')
    async ingresar(@Body() logindto: loginDTO): Promise<{token: string}> {
        return this.servicioUsuario.signIn(logindto);
    }

    //Endpoint para registrarse en la app
    @Post('registrar')
    async registrarse(@Body() signupdto :signupDTO): Promise<{token: string}> {
        return this.servicioUsuario.signUp(signupdto);
    }

    @Post('facebook')
    async facebookLogin(@Body() body):Promise<{token:string}>{
        const usuario = this.servicioUsuario.encontrarOCrear(body);
        console.log(usuario);
        return await this.servicioUsuario.facebookLogin(usuario);
    }

    @Get('/:token')    
    async datosUsuario(@Param('token') token:string):Promise<Usuario>{
        const id = await this.servicioUsuario.obtenerIDporToken(token);
        const usuario = await this.servicioUsuario.obtenerPorID(id);
        console.log(usuario);
        return usuario;
    }


    @Put('actualizar')
    async actualizarDatos(@Headers() header, @Body() body) {
        const usuario = await this.servicioUsuario.actualizarDatos(header.token, body.nombre, body.apellido, body.email, body.plan);
        return usuario;
    }

    @Put('actualizar/pass')
    async actualizarPass(@Headers() headers, @Body() body) {
        const usuario = await this.servicioUsuario.cambiarContr(headers.token, body.pass)
        if (usuario) {
            return true;
        }
        return false;
    }




}
