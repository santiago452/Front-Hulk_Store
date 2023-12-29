// Creamos el servicio para enviar peticiones al servidor
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared-service';
import { Producto } from '../models/Producto';
@Injectable({
    providedIn: 'root'
})
export class RolService { 
    
    private path = this.sharedService.APIUrl + 'roles';

    constructor(private http: HttpClient, private sharedService: SharedService) {}

    public listarTodos(){
        return this.http.get<Producto>(this.path+'/verRoles');
    }

    public listarPorId(id: number){
    return this.http.get<Producto>(this.path+'/roles/'+id);
    }

    public registrar(objetoProducto: Producto){
    return this.http.post<void>(this.path+'/addRol',objetoProducto);
    }

    public actualizar(objetoModificarProducto: Producto){
    return this.http.put<void>(this.path+'/updateRoles/'+ objetoModificarProducto.id, objetoModificarProducto);
    }

    public eliminar(id: number){
    return this.http.delete<void>(this.path+'/deleteRoles/'+id);
    }
}
