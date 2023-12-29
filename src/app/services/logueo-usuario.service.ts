// Creamos el servicio para enviar peticiones al servidor
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/Usuario';
import { SharedService } from '../shared-service';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class UsuarioService { 
    
    private path = this.sharedService.APIUrl + 'usuario';
    private productosSubject = new BehaviorSubject<Usuario[]>([]);
    constructor(private http: HttpClient, private sharedService: SharedService) {}

    public obtenerUsuarios() {
        this.http.get<Usuario[]>(this.path+'/verUsuarios').subscribe(
          usuarios => this.productosSubject.next(usuarios)
        );
    }

    public obtenerUsuariosObservable(): Observable<Usuario[]> {
        return this.productosSubject.asObservable();
    }
    public listarTodos(){
        return this.http.get<Usuario>(this.path+'/verUsuarios');
    }

    public listarPorId(id: number){
    return this.http.get<Usuario>(this.path+'/usuario/'+id);
    }

    public registrar(objetoUsuario: Usuario){
    return this.http.post<void>(this.path+'/addUsuario',objetoUsuario);
    }

    public actualizar(objetoModificarUsuario: Usuario){
    return this.http.put<void>(this.path+'/updateUsuario/'+ objetoModificarUsuario.id, objetoModificarUsuario);
    }

    public eliminar(id: number){
    return this.http.delete<void>(this.path+'/deleteUsuario/'+id);
    }
}
