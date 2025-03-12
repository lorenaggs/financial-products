import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { FinancialProductApiService } from '../../infrastructure/adapters/financialProductApiService';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productServiceMock: jest.Mocked<FinancialProductApiService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    productServiceMock = {
      getFinancialProducts: jest.fn().mockReturnValue(of([{
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'test-logo.png',
        date_release: '2025-03-10',
        date_revision: '2026-03-10'
      }])),
      deleteFinancialProduct: jest.fn().mockReturnValue(of(null))
    } as unknown as jest.Mocked<FinancialProductApiService>;

    routerMock = {
      url: '/products',
      events: of(),
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      providers: [
        { provide: FinancialProductApiService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(component.listProducts.length).toBe(1);
    expect(component.allProducts.length).toBe(1);
  });

  it('should filter products by search term', () => {
    component.searchTerm = 'test';
    component.searchProducts();
    expect(component.listProducts.length).toBe(1);
  });

  it('should show all products when search is cleared', () => {
    component.searchTerm = '';
    component.searchProducts();
    expect(component.listProducts.length).toBe(1);
  });

  it('should toggle dropdown visibility', () => {
    component.toggleDropdown('1');
    expect(component.openDropdownId).toBe('1');
    component.toggleDropdown('1');
    expect(component.openDropdownId).toBeNull();
  });

  it('should open modal with correct product data', () => {
    component.openModal('1', 'Test Product');
    expect(component.selectedProductId).toBe('1');
    expect(component.selectedProductName).toBe('Test Product');
    expect(component.showDeleteModal).toBeTruthy();
  });

  it('should close modal and reset selected product data', () => {
    component.closeModal();
    expect(component.showDeleteModal).toBeFalsy();
    expect(component.selectedProductId).toBeNull();
    expect(component.selectedProductName).toBe('');
  });

  it('should delete a product when confirmed', () => {
    component.selectedProductId = '1';
    component.confirmDelete();
    expect(productServiceMock.deleteFinancialProduct).toHaveBeenCalledWith('1');
  });

  it('should update displayed products when quantity changes', () => {
    component.selectedQuantity = 1;
    component.updateDisplayedProducts();
    expect(component.listProducts.length).toBe(1);
  });
});
