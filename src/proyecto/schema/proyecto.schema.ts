import { Schema , Prop, SchemaFactory} from "@nestjs/mongoose";
import { Usuario } from "src/usuario/schema/usuario.schema";

@Schema({versionKey:false})
export class Proyecto {

    @Prop()
    f_crea:Date;
    
    @Prop()
    u_mod:Date;
    
    @Prop()
    colaboradores:Array<Usuario>;
    
    @Prop()
    creador:Usuario;
    
    @Prop({type:Object})
    raiz:Object;
    
    @Prop()
    nombre:string;

}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);