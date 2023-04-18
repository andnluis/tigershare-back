import { Module } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProyectoSchema } from './schema/proyecto.schema';

@Module({
  imports: [UsuarioModule, MongooseModule.forFeature([{name:'Proyecto', schema:ProyectoSchema}])],
  controllers: [ProyectoController],
  providers: [ProyectoService]
})
export class ProyectoModule {}
