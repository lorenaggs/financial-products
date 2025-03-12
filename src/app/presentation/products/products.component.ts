import {Component, OnInit} from '@angular/core';
import {FinancialProductApiService} from '../../infrastructure/adapters/financialProductApiService';
import {CommonModule} from '@angular/common';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {CreateProductComponent} from './create-product/create-product.component';
import {HeaderComponent} from './header/header.component';
import {FormsModule} from '@angular/forms';
import {FinancialProduct} from '../../domain/models/financial-product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, CreateProductComponent, HeaderComponent, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  listProducts: FinancialProduct[] = [];
  showListProducts = true;
  searchTerm: string = '';
  allProducts: FinancialProduct[] = [];
  selectedQuantity: number = 5;
  showForm = false;

  constructor(
    public financialProductService: FinancialProductApiService,
    private router: Router,
  ) {
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.showForm = currentRoute.includes('new-product') || currentRoute.includes('edit-product');
    });
  }

  ngOnInit(): void {
    this.financialProductService.getFinancialProducts().subscribe(
      (products) => {
        this.listProducts = products;
        this.allProducts = products;
        this.updateDisplayedProducts();
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

  updateDisplayedProducts(): void {
    this.listProducts = this.allProducts.slice(0, this.selectedQuantity);
  }

  onQuantityChange(event: Event): void {
    this.selectedQuantity = parseInt((event.target as HTMLSelectElement).value, 10);
    this.updateDisplayedProducts();
  }

  goToEdit(): void {
    this.showForm = true;
  }

}
