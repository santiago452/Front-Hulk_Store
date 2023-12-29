import { Routes } from '@angular/router';
import { LoginComponent } from './vista/formulario-loguarse/login/login.component';
import { CrearCuentaComponent } from './vista/formulario-loguarse/crear-cuenta/crear-cuenta.component';
import { MostrarProductosComponent } from './vista/mostrar-productos/mostrar-productos.component';
import { AuthenticationGuard } from './services/AuthenticationGuard.service';
import { ProductosComponent } from './vista/mostrar-productos/productos/productos.component';
import { CarritoProductosComponent } from './vista/mostrar-productos/carrito-productos/carrito-productos.component';
import { ListarProductosComponent } from './vista/mostrar-productos/productos/listar-productos/listar-productos.component';
import { AgregarProductoComponent } from './vista/mostrar-productos/productos/listar-productos/agregar-producto/agregar-producto.component';
import { ActualizarProductoComponent } from './vista/mostrar-productos/productos/listar-productos/actualizar-producto/actualizar-producto.component';
import { ListarUsuariosComponent } from './vista/mostrar-productos/administrador/listar-usuarios/listar-usuarios.component';
import { AgregarUsuarioComponent } from './vista/mostrar-productos/administrador/listar-usuarios/agregar-usuario/agregar-usuario.component';
import { ModificarUsuarioComponent } from './vista/mostrar-productos/administrador/listar-usuarios/modificar-usuario/modificar-usuario.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'crearCuenta',
        component: CrearCuentaComponent
    },
    {
        path: '',
        component: MostrarProductosComponent,
        // canActivateChild: [AuthenticationGuard],
        children: [
            {
                path: '',
                component: ProductosComponent
            },
            {
                path: 'Carrito',
                component: CarritoProductosComponent
            },
            {
                path: 'Productos',
                component: ListarProductosComponent,
                canActivateChild: [AuthenticationGuard],
                children: [
                    {
                        path: 'nuevoProducto',
                        component: AgregarProductoComponent,
                        canActivateChild: [AuthenticationGuard],
                    },
                    {
                        path: 'actualizarProducto/:id',
                        component: ActualizarProductoComponent,
                        canActivateChild: [AuthenticationGuard],
                    },
                ]
            },
            {
                path: 'Usuarios',
                component: ListarUsuariosComponent,
                canActivateChild: [AuthenticationGuard],
                children: [
                    {
                        path: 'nuevoUsuario',
                        component: AgregarUsuarioComponent,
                        canActivateChild: [AuthenticationGuard],
                    },
                    {
                        path: 'actualizarUsuario/:id',
                        component: ModificarUsuarioComponent,
                        canActivateChild: [AuthenticationGuard],
                    }
                ]
            }
        ]
    }
];
