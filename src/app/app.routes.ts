import { Routes } from '@angular/router';
import {ProductsComponent} from './presentation/components/products.component';
import {CreateProductComponent} from './presentation/components/create-product/create-product.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductsComponent
  },
  {
    path: 'new-product',
    component: CreateProductComponent
  },
  {
    path: 'edit-product/:id',
    component: CreateProductComponent
  }
];
