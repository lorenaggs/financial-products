import {Component, OnInit} from '@angular/core';
import {FinancialProductApiService} from '../../infrastructure/adapters/financialProductApiService';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {CreateProductComponent} from './create-product/create-product.component';
import {HeaderComponent} from './header/header.component';
import {FormsModule} from '@angular/forms';
import {FinancialProduct} from '../../domain/models/financial-product.model';
import {ModalComponent} from './modal/modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, CreateProductComponent, HeaderComponent, FormsModule, NgOptimizedImage, ModalComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  listProducts: FinancialProduct[] = [];
  searchTerm: string = '';
  allProducts: FinancialProduct[] = [];
  selectedQuantity: number = 5;
  showForm = false;
  openDropdownId: string | null = null;
  selectedProductId: string | null = null;
  selectedProductName: string = '';
  showDeleteModal = false;
  message: string = '';

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

  toggleDropdown(productId: string): void {
    this.openDropdownId = this.openDropdownId === productId ? null : productId;
  }

  deleteProduct(): void {
    if (!this.selectedProductId) return;
    this.financialProductService.deleteFinancialProduct(this.selectedProductId).subscribe(() => {
      this.listProducts = this.listProducts.filter((product) => product.id !== this.selectedProductId);
      this.allProducts = this.allProducts.filter((product) => product.id !== this.selectedProductId);
      this.updateDisplayedProducts();
    });

   /* this.financialProductService.deleteFinancialProduct(this.selectedProductId).subscribe(() => {
      this.listProducts = this.listProducts.filter((product) => product.id !== productId);
      this.allProducts = this.allProducts.filter((product) => product.id !== productId);
      this.updateDisplayedProducts();
    });*/
  }

  openModal(productId: string, productName: string): void {
    this.selectedProductId = productId;
    this.selectedProductName = productName;
    this.message = productName;
    this.showDeleteModal = true;
  }

  closeModal(): void {
    this.showDeleteModal = false;
    this.selectedProductId = null;
    this.selectedProductName = '';
  }

  confirmDelete(): void {
    if (!this.selectedProductId) return;

    this.financialProductService.deleteFinancialProduct(this.selectedProductId).subscribe(() => {
      /*this.listProducts = this.listProducts.filter(p => p.id !== this.selectedProductId);
      this.updateDisplayedProducts();*/
      this.listProducts = this.listProducts.filter((product) => product.id !== this.selectedProductId);
      this.allProducts = this.allProducts.filter((product) => product.id !== this.selectedProductId);
      this.updateDisplayedProducts();
      this.showDeleteModal = false;
      alert('Producto eliminado correctamente.');
    });
  }

}
