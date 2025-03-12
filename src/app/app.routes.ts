import { Routes } from '@angular/router';
import {ProductsComponent} from './presentation/products/products.component';
import {CreateProductComponent} from './presentation/products/create-product/create-product.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductsComponent
  },
  {
    path: 'new-product',
    component: CreateProductComponent
  }
];
