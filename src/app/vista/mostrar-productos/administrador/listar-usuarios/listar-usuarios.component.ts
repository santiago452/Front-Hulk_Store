import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { ComunicacionComponentesService } from '../../../../services/comunicacion-componentes.service';
import { UsuarioService } from '../../../../services/logueo-usuario.service';
import { Usuario } from '../../../../models/Usuario';


@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [AngularMaterialModule, RouterModule],
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.css'
})
export class ListarUsuariosComponent {
  displayedColumns: string[] = ['id','nombre', 'correo','contrasena', 'rol', 'acciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator)paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort 
  listaProductos: any = [];
  comunicacionComponentes = inject(ComunicacionComponentesService);
  servicioUsuario = inject(UsuarioService);

  ngOnInit() {
      this.listarTodos();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
   
  }


  listarTodos(){
    this.servicioUsuario.obtenerUsuarios();
    this.servicioUsuario.obtenerUsuariosObservable().subscribe((oficinaMujer: Usuario[]) => {
      this.listaProductos = oficinaMujer;
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
          'El usuario ha sido eliminado.',
          'success'
        ).then(() => {
          // Aquí puedes agregar código que se ejecute después de que el usuario cierra la alerta de éxito
          this.servicioUsuario.eliminar(id).subscribe(() => {
            this.servicioUsuario.obtenerUsuarios();
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
      this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
        return data.nombre.toLowerCase().includes(filter) || data.correo.toLowerCase().includes(filter);
      };

    }else{
      this.dataSource = new MatTableDataSource(this.listaProductos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
}
