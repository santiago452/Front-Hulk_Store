import { Component, inject } from '@angular/core';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../../../services/logueo-usuario.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AngularMaterialModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public formSesion!: FormGroup;

  servicioUsuario = inject(UsuarioService);
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    // private loginService: LoginService
  ) { 
    this.formSesion = this.formBuilder.group({
      email: ['', Validators.required, this.validarCorreo],
      contrasena: ['', Validators.required]
    });
  }

  async iniciarSesion(): Promise<void> {
    if(this.formSesion.valid){
      const usuariosAll = await this.servicioUsuario.listarTodos().toPromise() as any;
      const verificarUsuario = usuariosAll.find((usuario: any) => usuario.correo === this.formSesion.value.email && usuario.contrasena === this.formSesion.value.contrasena);
      // Colocamos un spinner mientras se verifica el usuario
      this.mostrarSpinner(true);
      if(verificarUsuario){
        setTimeout(() => {
          this.mostrarSpinner(false);
          sessionStorage.setItem('usuario', JSON.stringify(verificarUsuario));
          this.router.navigate(['/Productos']);
        }, 2000);
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El correo o la contraseña son incorrectos',
        });
      }
    }
  }

  private mostrarSpinner(mostar: boolean): void {
    if(mostar){
      Swal.fire({
        title: 'Verificando usuario',
        allowOutsideClick: false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    }else{
      Swal.close();
    }
  }


  validarCorreo(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise<ValidationErrors | null>((resolve, reject) => {
      const correo = control.value;
      // Validamos que tenga un @ y un .com
      if (correo.includes('@')) {
        resolve(null);
      }
      resolve({ noEsCorreo: true });
    });
  }
}
