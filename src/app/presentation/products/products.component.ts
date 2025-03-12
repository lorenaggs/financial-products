import {Component, OnInit} from '@angular/core';
import {FinancialProductApiService} from '../../infrastructure/adapters/financialProductApiService';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {CreateProductComponent} from './create-product/create-product.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, CreateProductComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  listProducts: any[] = [];
  showListProducts = true;

  constructor(
    public financialProductService: FinancialProductApiService,
  ) {
  }

  ngOnInit(): void {
    this.financialProductService.getFinancialProducts().subscribe(
      (products) => {
        this.listProducts = products;
        console.log(products);
      }
    );
  }

  addProduct(): void {
    this.showListProducts = false;
    /*this.financialProductService.createFinancialProduct({
      id: '1',
      name: 'Producto 1',
      description: 'Descripcion del producto 1',
      price: 1000
    }).subscribe(
      (response) => {
        console.log(response);
      }
    );*/
  }
}
