import { Component, inject } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { Router, RouterLink, RouterModule, provideRouter } from '@angular/router';
import { ComunicacionComponentesService } from '../../services/comunicacion-componentes.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mostrar-productos',
  standalone: true,
  imports: [AngularMaterialModule, RouterModule],
  templateUrl: './mostrar-productos.component.html',
  styleUrl: './mostrar-productos.component.css'
})
export class MostrarProductosComponent {

  isLogged = false;
  isAdministrador = false;
  router: Router = inject(Router);
  servicioComunicacion = inject(ComunicacionComponentesService);
  _snackBar: MatSnackBar = inject(MatSnackBar);
  constructor() { }

  ngOnInit(): void {
    const usuario = sessionStorage.getItem('usuario');
    if (usuario) {this.isLogged = true;}
    // Validamo si el usuario es el administrador
    if (usuario && JSON.parse(usuario).idRol.rolId === 1) {
      this.isAdministrador = true;
    }
  }
  cerrarSesion(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
    this.isLogged = false;
    this.isAdministrador = false;
    this._snackBar.open('Sesión cerrada exitosamente', 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
