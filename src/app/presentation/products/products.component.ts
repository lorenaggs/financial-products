import {Component, OnInit} from '@angular/core';
import {FinancialProductApiService} from '../../infrastructure/adapters/financialProductApiService';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {CreateProductComponent} from './create-product/create-product.component';
import {HeaderComponent} from './header/header.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, CreateProductComponent, HeaderComponent, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  listProducts: any[] = [];
  showListProducts = true;
  searchTerm: string = '';
  allProducts: any[] = []; // Data original

  constructor(
    public financialProductService: FinancialProductApiService,
  ) {
  }

  ngOnInit(): void {
    this.financialProductService.getFinancialProducts().subscribe(
      (products) => {
        this.listProducts = products;
        this.allProducts = products; // Guardamos la data original
        console.log(products);
      }
    );
  }

  addProduct(): void {
    this.showListProducts = false;
  }

  searchProducts(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.listProducts = this.allProducts;
      return;
    }

    this.listProducts = this.allProducts.filter((product) => {
      return product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);
    });
  }
}
