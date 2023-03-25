import { Schema , Prop, SchemaFactory} from "@nestjs/mongoose";

export enum Plan {
    ROOKIE = 'Rookie',
    ALLY = 'Ally',
    ELITE = 'Elite'
}

@Schema({versionKey: false})
export class Usuario {

    @Prop()
    nombre:string;

    @Prop()
    apellido:string;

    @Prop()
    user:string;

    @Prop()
    email:string;

    @Prop()
    plan:Plan;

    @Prop()
    fnac:Date;

    @Prop()
    pass:string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);