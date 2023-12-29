import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AngularMaterialModule } from '../../../../../angular-material/angular-material.module';
import { ComunicacionComponentesService } from '../../../../../services/comunicacion-componentes.service';
import { ProductoService } from '../../../../../services/producto.service';
@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [AngularMaterialModule, RouterModule],
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css'
})
export class AgregarProductoComponent {

  public formUsuario!: FormGroup;
  public roles: any = [];
  public tiposDocumento: any = [];
  comunicacionComponentes = inject(ComunicacionComponentesService);
  servicioProducto = inject(ProductoService);
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit() {
    this.crearFormulario();
  }

 

  private crearFormulario() {
    this.formUsuario = this.fb.group({
      nombre: [null,Validators.required],
      cantidad: [null,Validators.required, this.validateNumberFormat],
      precio: [null,Validators.required, this.validateNumberFormat],
      imagen: [null,Validators.required],
    });
  }

  public async agregarOficina(){
    if(this.formUsuario.valid){
      const productos = await this.servicioProducto.listarTodos().toPromise() as any;
      // Validamos si existe un producto con el mismo nombre
      const producto = productos.find((producto: any) => producto.nombre === this.formUsuario.get('nombre')?.value);
      if (producto) {
        Swal.fire({
          title: 'Error',
          text: 'Ya existe un producto con el mismo nombre',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      } else {
        this.servicioProducto.registrar(this.formUsuario.value).subscribe((response: any) => {
          console.log(response);
            Swal.fire({
              title: 'Éxito',
              text: 'Producto registrado exitosamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.servicioProducto.obtenerProductos();
              this.router.navigate(['/Productos']);
            });
          
        });
      }     
      
    }else{
      this.formUsuario.markAllAsTouched();
    }
  }

  

  // Validar que el número de teléfono solo contenga números en promesa
  public validateNumberFormat(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise<ValidationErrors | null>((resolve, reject) => {
      const telefono = control.value;
      if (!/^[0-9]*$/.test(telefono)) {
        resolve({ pattern: true, message: 'Por favor ingresar solo números.' } );
      } 
      resolve(null);
    });
  }
}
