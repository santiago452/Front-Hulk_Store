import { Rol } from "./Rol";

export class Usuario{
    public id: number = 0;
    public nombre: string = '';
    public correo : string = '';
    public contrasena : string = '';
    idRol !: Rol;
}