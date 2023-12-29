import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
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
  selector: 'app-modificar-usuario',
  standalone: true,
  imports: [AngularMaterialModule, RouterModule],
  templateUrl: './modificar-usuario.component.html',
  styleUrl: './modificar-usuario.component.css'
})
export class ModificarUsuarioComponent {
  public formUsuario!: FormGroup;
  public roles: any = [];
  public tiposDocumento: any = [];
  comunicacionComponentes = inject(ComunicacionComponentesService);
  servicioUsuario = inject(UsuarioService);
  listaRoles: any = [];
  servicioRoles = inject(RolService);
  route: ActivatedRoute = inject(ActivatedRoute);
  id!: any;
  nombreUsuario!: string;
  private correoUsuario!: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit() {
    this.crearFormulario();
    this.listarDatosUsuarios();
    this.listarRoles();
  }

  private listarDatosUsuarios(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.id = id;
      this.servicioUsuario.listarPorId(Number(id)).subscribe((usuario:any) => {
        this.nombreUsuario = usuario.nombre;
        this.correoUsuario = usuario.correo;
        this.formUsuario.patchValue({
          id: usuario.usuarioId,
          nombre: usuario.nombre.split(' ').slice(0, -2).join(' '),
          apellido: usuario.nombre.split(' ').slice(-2).join(' '),
          contrasena: CryptoJS.AES.decrypt(usuario.contrasena, 'secret key 123').toString(CryptoJS.enc.Utf8),
          email: usuario.correo,
          rol: usuario.idRol
        });
        console.log(this.formUsuario.value);
      });
    });
  }

  private crearFormulario() {
    this.formUsuario = this.fb.group({
      id: [null],
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
    if(this.formUsuario.dirty){
      if(this.formUsuario.valid){
        // Validamos si el correo del formulario se cambió
        if(this.formUsuario.get('email')?.value !== this.correoUsuario){
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
        }
        const usuario: Usuario = new Usuario();
        usuario.id = this.formUsuario.value.id;
        usuario.nombre = this.formUsuario.value.nombre + ' ' + this.formUsuario.value.apellido;
        usuario.correo = this.formUsuario.value.email;
        const contrasena = this.formUsuario.get('contrasena')?.value;
        const encryptedPassoword = CryptoJS.AES.encrypt(contrasena.trim(), 'secret key 123').toString();
        usuario.contrasena = encryptedPassoword;
        usuario.idRol = this.formUsuario.value.rol;
        this.servicioUsuario.actualizar(usuario).subscribe(
          (response) => {
            console.log(response);
            Swal.fire({
              icon: 'success',
              title: 'Usuario creado',
              text: 'Se ha modificado el usuario correctamente',
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
    }else{
      Swal.fire({
        icon: 'success',
        text: 'No hubo cambios en el usuario',
        showConfirmButton: false,
        timer: 1500,
        willClose: () => {
          this.servicioUsuario.obtenerUsuarios();
          this.router.navigate(['/Usuarios']);
        }
      });
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

  compareFunction(o1: any, o2: any) {
    return o1 && o2 ? o1.descripcion === o2.descripcion : o1 === o2;
  }
}
