import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateProductComponent } from './create-product.component';
import {AbstractControl, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { FinancialProductApiService } from '../../../infrastructure/adapters/financialProductApiService';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NgClass } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let productServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    productServiceMock = {
      verificationId: jest.fn().mockReturnValue(of(false)), // Siempre retorna false (ID no existe)
      createFinancialProduct: jest.fn().mockReturnValue(of({ message: 'Product added successfully' })),
      updateFinancialProduct: jest.fn().mockReturnValue(of({ message: 'Product updated successfully' })),
      getFinancialProductById: jest.fn().mockReturnValue(of({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'test-logo.png',
        date_release: '2025-03-10',
        date_revision: '2026-03-10'
      }))
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NgClass, HeaderComponent],
      providers: [
        FormBuilder,
        { provide: FinancialProductApiService, useValue: productServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('id')?.value).toBe('');
  });

  it('should validate required fields', () => {
    component.productForm.get('id')?.setValue('');
    component.productForm.get('name')?.setValue('');
    component.productForm.get('description')?.setValue('');
    component.productForm.get('logo')?.setValue('');
    component.productForm.get('date_release')?.setValue('');

    expect(component.productForm.valid).toBeFalsy();
  });

  it('should validate ID length constraints', () => {
    component.productForm.get('id')?.setValue('12');
    expect(component.productForm.get('id')?.valid).toBeFalsy();

    component.productForm.get('id')?.setValue('12345678901');
    expect(component.productForm.get('id')?.valid).toBeFalsy();
  });

  it('should validate name length constraints', () => {
    component.productForm.get('name')?.setValue('1234');
    expect(component.productForm.get('name')?.valid).toBeFalsy();
  });

  it('should validate description length constraints', () => {
    component.productForm.get('description')?.setValue('123456789');
    expect(component.productForm.get('description')?.valid).toBeFalsy();
  });

  it('should call product service on create', () => {
    component.productForm.setValue(
      {
      "id": "doss",
      "name": "dossdossdoss",
      "description": "dossdossdoss",
      "logo": "dossdoss",
      "date_release": "2025-03-13", "date_revision": "2026-03-13"
      }
    );


    component.productForm.updateValueAndValidity(); // Forzar la actualización de validaciones

    component.onSubmit();

    expect(productServiceMock.createFinancialProduct).toHaveBeenCalled();
  });

  it('should call product service on update', () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue('123');
    component = new CreateProductComponent(activatedRouteMock, new FormBuilder(), productServiceMock);
    component.isEditMode.set(true);
    component.idParam = '123';

    component.productForm.setValue({
      id: '123',
      name: 'NEW Product',
      description: 'Updated Description',
      logo: 'updated-logo.png',
      date_release: '2025-03-10',
      date_revision: '2026-03-10'
    });


    component.productForm.updateValueAndValidity(); // Forzar la actualización de validaciones
    expect(component.productForm.valid).toBeTruthy(); // Verifica que sea válido

    const submitSpy = jest.spyOn(productServiceMock, 'createFinancialProduct'); // Espía la llamada

    component.onSubmit();

    expect(submitSpy).toHaveBeenCalled();
    expect(productServiceMock.updateFinancialProduct).toHaveBeenCalled();
  });

  it('should disable ID field in edit mode', () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue('123');
    component = new CreateProductComponent(activatedRouteMock, new FormBuilder(), productServiceMock);
    component.isEditMode.set(true);
    component.loadProduct();
    fixture.detectChanges();

    expect(component.productForm.get('id')?.disabled).toBeTruthy();
  });

  it('should reset the form on reset', () => {
    component.productForm.patchValue({ id: '123', name: 'Product' });
    component.onReset();
    expect(component.productForm.get('name')?.value).toBeFalsy();
  });
});
