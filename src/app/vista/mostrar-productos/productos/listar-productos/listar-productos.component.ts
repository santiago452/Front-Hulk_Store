import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { ProductoService } from '../../../../services/producto.service';
import { Producto } from '../../../../models/Producto';
import { ComunicacionComponentesService } from '../../../../services/comunicacion-componentes.service';

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [AngularMaterialModule, RouterModule],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.css'
})
export class ListarProductosComponent {

  displayedColumns: string[] = ['id','imagen','nombre', 'cantidad','precio', 'acciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator)paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort 
  listaProductos: any = [];
  comunicacionComponentes = inject(ComunicacionComponentesService);
  servicioProducto = inject(ProductoService);

  ngOnInit() {
      this.listarTodos();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
   
  }


  listarTodos(){
    this.servicioProducto.obtenerProductos();
    this.servicioProducto.obtenerProductosObservable().subscribe((oficinaMujer: Producto[]) => {
      this.listaProductos = oficinaMujer;
      console.log(this.listaProductos);
      this.dataSource = new MatTableDataSource(this.listaProductos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  eliminar(id:number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mx-5'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estas seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result:any) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'El producto ha sido eliminado.',
          'success'
        ).then(() => {
          // Aquí puedes agregar código que se ejecute después de que el usuario cierra la alerta de éxito
          this.servicioProducto.eliminar(id).subscribe(() => {
            this.servicioProducto.obtenerProductos();
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelado!',
          '',
          'error'
        );
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue.length > 0){
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.dataSource.filterPredicate = (data: Producto, filter: string) => {
        return data.nombre.toLowerCase().includes(filter) || String(data.cantidad).toLowerCase().includes(filter) || String(data.precio).toLowerCase().includes(filter);
      };

    }else{
      this.dataSource = new MatTableDataSource(this.listaProductos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
}
