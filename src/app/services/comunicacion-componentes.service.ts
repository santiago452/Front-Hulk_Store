import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ComunicacionComponentesService {

    public carroComprasBehaviorSubject = new BehaviorSubject<any>({});
    public carroCompras: any[] = [];
    public rutasActivas: string[] = [];
    router: Router = inject(Router);

    constructor() {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const url = event.url;
          this.rutasActivas.push(event.url);
          // Si la url es diferente a la ruta que se encuentra en el arreglo de rutas activas se elimina la ruta del arreglo
          if (this.rutasActivas.length > 1) {
            this.rutasActivas.splice(this.rutasActivas.length - 2, 1);
          }
        }
      });
    }

    // actualizarCarroCompras(valor: any) {this.carroComprasBehaviorSubject.next(valor);}

    carroComprasObservable(): Observable<any> {return this.carroComprasBehaviorSubject.asObservable();}

    actualizarCarroCompras(valor: any) {this.carroComprasBehaviorSubject.next(valor); this.carroCompras.push(valor);
        const carro = this.carroCompras;
        window.onbeforeunload = () => {
          // Validamos si el sessionStorage tiene datos
          const sessionStorageValue = sessionStorage.getItem('objCarro');
          if (sessionStorageValue) {
            // Validamos si carro tiene datos
            if (carro.length > 0) {
              // Validamos si el objeto que está en sessionStorage es igual al objeto que está en carro
              if (JSON.stringify(carro) === sessionStorageValue) {
                // Si son iguales, no hacemos nada
                return;
              } else {
                // Si son diferentes, guardamos el carro en sessionStorage
                sessionStorage.setItem('objCarro', JSON.stringify(carro));
              }
            }
          } else {
            // Si no existe un valor en sessionStorage, guardamos el carro si tiene datos
            if (carro.length > 0) {
              sessionStorage.setItem('objCarro', JSON.stringify(carro));
            }
          }
        };
      }
  
      modificarCarroCompras(valor: any) {this.carroComprasBehaviorSubject.next({}); this.carroCompras = valor; 
        const carro = this.carroCompras;
        window.onbeforeunload = () => {
          // Validamos si el sessionStorage tiene datos
          const sessionStorageValue = sessionStorage.getItem('objCarro');
          if (sessionStorageValue) {
            // Validamos si carro tiene datos
            if (carro.length >= 0) {
              // Validamos si el objeto que está en sessionStorage es igual al objeto que está en carro
              if (JSON.stringify(carro) === sessionStorageValue) {
                // Si son iguales, no hacemos nada
                return;
              } else {
                // Si son diferentes, guardamos el carro en sessionStorage
                sessionStorage.setItem('objCarro', JSON.stringify(carro));
              }
            }
          } else {
            // Si no existe un valor en sessionStorage, guardamos el carro si tiene datos
            if (carro.length > 0) {
              sessionStorage.setItem('objCarro', JSON.stringify(carro));
            }
          }
        };
      }
}