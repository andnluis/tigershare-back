/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { loginDTO } from './dto/loginDTO';
import { signupDTO } from './dto/signupDTO';
import { Usuario } from './schema/usuario.schema';
import { UsuarioService } from './usuario.service';
import { AuthGuard } from '@nestjs/passport';

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

    @Get('facebook')
    @UseGuards(AuthGuard('facebook'))
    async facebookLogin(){

    }

    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookLoginCallback(@Req() req){
        return 'somehow we got here';
    }

    @Get(':token')
    async obtenerDatos(@Param('token') token:string): Promise<Usuario> {
        const id = await this.servicioUsuario.obtenerIDporToken(token);
        const usuario = await this.servicioUsuario.obtenerPorID(id);
        return usuario;
    }



}
