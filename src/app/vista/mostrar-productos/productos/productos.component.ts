import { Component, inject } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
 servicioProducto = inject(ProductoService);
 listadoProductos: any[] = [];
  constructor() { }

  async ngOnInit(): Promise<void> {
    await this.listarProductos();
    
  }

  async listarProductos(): Promise<void> {
    const productos = await this.servicioProducto.listarTodos().toPromise() as any;
    console.log(productos);
    this.listadoProductos = productos;

  }

}
