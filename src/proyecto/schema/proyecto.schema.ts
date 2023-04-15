import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Usuario } from 'src/usuario/schema/usuario.schema';

@Schema({versionKey: false})
export class Proyecto {
    @Prop()
    identificador: string; //nombre del proyecto

    @Prop()
    f_crea: Date; //fecha de creacion del proyecto

    @Prop()
    u_mod: Date; //ultima fecha en la que fue modificado el proyecto

    @Prop()
    colaboradores: Array<Usuario>; //Arreglo de personas que tienen acceso al proyecto

    @Prop()
    creador : Usuario; // Usuario que creo el proyecto

    @Prop({type: Object})
    raiz : object = {}; // Objeto que simula la  Carpeta de los archivos
}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);