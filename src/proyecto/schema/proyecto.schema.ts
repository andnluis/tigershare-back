import { Schema , Prop, SchemaFactory} from "@nestjs/mongoose";
import { Usuario } from "src/usuario/schema/usuario.schema";
import * as mongoose from 'mongoose';

@Schema({versionKey:false})
export class Proyecto {

    @Prop()
    f_crea:Date;
    
    @Prop()
    u_mod:Date;
    
    @Prop({type: Array<mongoose.Types.ObjectId> , ref: 'Usuario'})
    colaboradores:Array<Usuario>;
    
    @Prop({type: mongoose.Types.ObjectId , ref: 'Usuario'})
    creador:Usuario;
    
    @Prop({type:Object})
    raiz:{
        html:string;
        css:string;
        js:string;
    }
    
    @Prop()
    nombre:string;

}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);