import {Component, OnInit} from '@angular/core';
import {FinancialProductApiService} from '../../infrastructure/adapters/serviceCommon';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  providers: [HttpClient],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  listProducts: any[] = [];

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
