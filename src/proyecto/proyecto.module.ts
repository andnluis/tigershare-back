import { Module } from '@nestjs/common';
import { ProyectoController } from './proyecto.controller';
import { ProyectoService } from './proyecto.service';
import { UsuarioService } from 'src/usuario/usuario.service';

@Module({
  imports: [UsuarioService],
  controllers: [ProyectoController],
  providers: [ProyectoService]
})
export class ProyectoModule {}
