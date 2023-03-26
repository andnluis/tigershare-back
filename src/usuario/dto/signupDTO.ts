import { Plan } from "../schema/usuario.schema";


//Clase del prototipo de objeto que se espera recibir en una peticion.
export class signupDTO {
    readonly nombre:string;
    readonly apellido:string;
    readonly user:string;
    readonly email:string;
    readonly plan:Plan;
    readonly fnac:Date;
    readonly pass:string;
}