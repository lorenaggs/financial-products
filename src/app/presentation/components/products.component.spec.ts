import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { FinancialProductApiService } from '../../infrastructure/adapters/financialProductApiService';
import { Router, Event, NavigationEnd , ActivatedRoute, ParamMap} from '@angular/router';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancialProduct } from '../../domain/models/financial-product.model';
import { HeaderComponent } from './header/header.component';
import { ModalComponent } from './modal/modal.component';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let financialProductServiceMock: jest.Mocked<FinancialProductApiService>;
  let routerMock: jest.Mocked<Router>;
  let routerEvents: Subject<Event>;
  let activatedRouteMock: Partial<ActivatedRoute>;

  const mockProducts: FinancialProduct[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: new Date('2024-03-15'),
      date_revision: new Date('2025-03-15')
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'logo2.png',
      date_release: new Date('2024-03-16'),
      date_revision: new Date('2025-03-16')
    }
  ];

  beforeEach(async () => {
    routerEvents = new Subject<Event>();
    const paramMapMock: ParamMap = {
      get: jest.fn().mockReturnValue(null),
      has: jest.fn().mockReturnValue(false),
      getAll: jest.fn().mockReturnValue([]),
      keys: []
    };

    financialProductServiceMock = {
      getFinancialProducts: jest.fn(),
      deleteFinancialProduct: jest.fn()
    } as any;

    routerMock = {
      events: routerEvents.asObservable(),
      url: '/products'
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ProductsComponent,
        CommonModule,
        FormsModule,
        HeaderComponent,
        ModalComponent
      ],
      providers: [
        { provide: FinancialProductApiService, useValue: financialProductServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load products on init', fakeAsync(() => {
      financialProductServiceMock.getFinancialProducts.mockReturnValue(of(mockProducts));

      fixture.detectChanges();
      tick();

      expect(component.listProducts).toEqual(mockProducts);
      expect(component.allProducts).toEqual(mockProducts);
    }));

    it('should update showForm based on router events', fakeAsync(() => {
      fixture.detectChanges();

      routerEvents.next(new NavigationEnd(1, '/new-product', '/'));
      tick();
      expect(component.showForm).toBeTruthy();

      routerEvents.next(new NavigationEnd(2, '/products', '/new-product'));
      tick();
      expect(component.showForm).toBeFalsy();
    }));
  });

  describe('Search functionality', () => {
    beforeEach(() => {
      component.allProducts = mockProducts;
      component.listProducts = mockProducts;
    });

    it('should filter products by name', () => {
      component.searchTerm = 'Product 1';
      component.searchProducts();

      expect(component.listProducts.length).toBe(1);
      expect(component.listProducts[0].name).toBe('Product 1');
    });

    it('should filter products by description', () => {
      component.searchTerm = 'Description 2';
      component.searchProducts();

      expect(component.listProducts.length).toBe(1);
      expect(component.listProducts[0].description).toBe('Description 2');
    });

    it('should show all products when search term is empty', () => {
      component.searchTerm = '';
      component.searchProducts();

      expect(component.listProducts).toEqual(mockProducts);
    });
  });

  describe('Quantity selection', () => {
    beforeEach(() => {
      component.allProducts = mockProducts;
    });


  });

  describe('Dropdown functionality', () => {
    it('should toggle dropdown', () => {
      component.toggleDropdown('1');
      expect(component.openDropdownId).toBe('1');

      component.toggleDropdown('1');
      expect(component.openDropdownId).toBeNull();
    });
  });

  describe('Modal functionality', () => {
    it('should open modal with correct product details', () => {
      component.openModal('1', 'Product 1');

      expect(component.selectedProductId).toBe('1');
      expect(component.selectedProductName).toBe('Product 1');
      expect(component.showDeleteModal).toBeTruthy();
    });

    it('should close modal and reset values', () => {
      component.openModal('1', 'Product 1');
      component.closeModal();

      expect(component.showDeleteModal).toBeFalsy();
      expect(component.selectedProductId).toBeNull();
      expect(component.selectedProductName).toBe('');
    });
  });

  describe('Delete functionality', () => {
    it('should delete product successfully', fakeAsync(() => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
      component.allProducts = mockProducts;
      component.listProducts = mockProducts;
      component.selectedProductId = '1';

      financialProductServiceMock.deleteFinancialProduct.mockReturnValue(of({}));

      component.confirmDelete();
      tick();

      expect(component.listProducts.length).toBe(1);
      expect(component.showDeleteModal).toBeFalsy();
      expect(alertSpy).toHaveBeenCalledWith('Producto eliminado correctamente.');
    }));

    it('should not delete product when selectedProductId is null', () => {
      component.selectedProductId = null;
      component.confirmDelete();

      expect(financialProductServiceMock.deleteFinancialProduct).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty product list', fakeAsync(() => {
      financialProductServiceMock.getFinancialProducts.mockReturnValue(of([]));

      fixture.detectChanges();
      tick();

      expect(component.listProducts).toEqual([]);
      expect(component.allProducts).toEqual([]);
    }));

    it('should handle search with special characters', () => {
      component.searchTerm = '!@#$%^';
      component.searchProducts();

      expect(component.listProducts).toEqual([]);
    });
  });
});
