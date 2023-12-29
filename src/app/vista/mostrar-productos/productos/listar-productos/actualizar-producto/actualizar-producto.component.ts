import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AngularMaterialModule } from '../../../../../angular-material/angular-material.module';
import { ComunicacionComponentesService } from '../../../../../services/comunicacion-componentes.service';
import { ProductoService } from '../../../../../services/producto.service';

@Component({
  selector: 'app-actualizar-producto',
  standalone: true,
  imports: [AngularMaterialModule, RouterModule],
  templateUrl: './actualizar-producto.component.html',
  styleUrl: './actualizar-producto.component.css'
})
export class ActualizarProductoComponent implements OnInit {

  public formUsuario!: FormGroup;
  public roles: any = [];
  public tiposDocumento: any = [];
  comunicacionComponentes = inject(ComunicacionComponentesService);
  servicioProducto = inject(ProductoService);
  route: ActivatedRoute = inject(ActivatedRoute);
  id!: any;
  nombreProducto!: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.listarDatosProductos();
  }

  ngOnInit() {
    this.crearFormulario();
    
  }

  private listarDatosProductos(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.id = id;
      this.servicioProducto.listarPorId(Number(id)).subscribe((oficinaMujer:any) => {
        this.nombreProducto = oficinaMujer.nombre;
        this.formUsuario.patchValue({
          id: oficinaMujer.productoId,
          nombre: oficinaMujer.nombre,
          cantidad: oficinaMujer.cantidad,
          precio: oficinaMujer.precio,
          imagen: oficinaMujer.imagen,
        });
      });
    });
  }

  private crearFormulario() {
    this.formUsuario = this.fb.group({
      id: [null],
      nombre: [null,Validators.required],
      cantidad: [null,Validators.required, this.validateNumberFormat],
      precio: [null,Validators.required, this.validateNumberFormat],
      imagen: [null,Validators.required],
    });
  }

  public async modificarProducto(){
    if(this.formUsuario.dirty ){
      if(this.formUsuario.valid){
        const productos = await this.servicioProducto.listarTodos().toPromise() as any;
        if(this.formUsuario.get('nombre')?.value !== this.nombreProducto){
          // Validamos si existe un producto con el mismo nombre
          const producto = productos.find((producto: any) => producto.nombre === this.formUsuario.get('nombre')?.value);
          if (producto) {
            Swal.fire({
              title: 'Error',
              text: 'Ya existe un producto con el mismo nombre',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        }
        this.servicioProducto.actualizar(this.formUsuario.value).subscribe((response: any) => {
          Swal.fire({
            title: 'Éxito',
            text: 'Producto actualizado exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.servicioProducto.obtenerProductos();
            this.router.navigate(['/Productos']);
          });
        });
            
      }else{
        this.formUsuario.markAllAsTouched();
      }
      
    }else{
      Swal.fire({
        title: 'Error',
        text: 'No hubo cambios en el producto',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        willClose: () => {
          this.servicioProducto.obtenerProductos();
          this.router.navigate(['/Productos']);
        }
      });
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
