import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AngularMaterialModule } from '../../../../../angular-material/angular-material.module';
import { ComunicacionComponentesService } from '../../../../../services/comunicacion-componentes.service';
import { ProductoService } from '../../../../../services/producto.service';
import { UsuarioService } from '../../../../../services/logueo-usuario.service';
import { Usuario } from '../../../../../models/Usuario';
import { RolService } from '../../../../../services/Rol.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-agregar-usuario',
  standalone: true,
  imports: [AngularMaterialModule, RouterModule],
  templateUrl: './agregar-usuario.component.html',
  styleUrl: './agregar-usuario.component.css'
})
export class AgregarUsuarioComponent {
  public formUsuario!: FormGroup;
  public roles: any = [];
  public tiposDocumento: any = [];
  comunicacionComponentes = inject(ComunicacionComponentesService);
  servicioUsuario = inject(UsuarioService);
  listaRoles: any = [];
  servicioRoles = inject(RolService);
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit() {
    this.crearFormulario();
    this.listarRoles();
  }

 

  private crearFormulario() {
    this.formUsuario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required, this.validarCorreo],
      contrasena: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }

  private listarRoles(){
    this.servicioRoles.listarTodos().subscribe((roles: any) => {
      this.listaRoles = roles;
    });
  }

  public async agregarUsuario(){
    if(this.formUsuario.valid){
      const usuariosAll = await this.servicioUsuario.listarTodos().toPromise() as any;
      const usuarioEncontrado = usuariosAll.find((usuario: Usuario) => usuario.correo === this.formUsuario.value.email);
      if(usuarioEncontrado){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El correo ya se encuentra registrado',
        });
        return;
      }
      const usuario: Usuario = new Usuario();
      usuario.nombre = this.formUsuario.value.nombre + ' ' + this.formUsuario.value.apellido;
      usuario.correo = this.formUsuario.value.email;
      const contrasena = this.formUsuario.get('contrasena')?.value;
      const encryptedPassoword = CryptoJS.AES.encrypt(contrasena.trim(), 'secret key 123').toString();
      usuario.contrasena = encryptedPassoword;
      usuario.idRol = this.formUsuario.value.rol;
      this.servicioUsuario.registrar(usuario).subscribe(
        (response) => {
          console.log(response);
          Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: 'Se ha creado el usuario correctamente',
            showConfirmButton: false,
            timer: 1500,
            willClose: () => {
              this.servicioUsuario.obtenerUsuarios();
              this.router.navigate(['/Usuarios']);
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }else{
      this.formUsuario.markAllAsTouched();
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
