import { TestBed } from '@angular/core/testing';
import { CommonHttpService } from './common-http.service';
import { FinancialProduct } from '../../domain/models/financial-product.model';
import { of, throwError } from 'rxjs';
import { environment } from '../../../eviroments/enviroment';
import {FinancialProductApiService} from './financialProductApiService';

describe('FinancialProductApiService', () => {
  let service: FinancialProductApiService;
  let httpServiceMock: jest.Mocked<CommonHttpService>;

  const mockProduct: FinancialProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'test-logo.png',
    date_release: new Date(),
    date_revision: new Date()
  };

  const mockApiResponse = {
    data: [mockProduct]
  };

  beforeEach(() => {
    // Crear mock del CommonHttpService
    httpServiceMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        FinancialProductApiService,
        { provide: CommonHttpService, useValue: httpServiceMock }
      ]
    });

    service = TestBed.inject(FinancialProductApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFinancialProducts', () => {
    it('should return financial products array on successful request', (done) => {
      httpServiceMock.get.mockReturnValue(of(mockApiResponse));

      service.getFinancialProducts().subscribe({
        next: (products) => {
          expect(products).toEqual([mockProduct]);
          expect(httpServiceMock.get).toHaveBeenCalledWith(`${environment.apiUrl}/bp/products`);
          done();
        }
      });
    });

    it('should handle error when request fails', (done) => {
      const errorMessage = 'Network error';
      httpServiceMock.get.mockReturnValue(throwError(() => new Error(errorMessage)));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      service.getFinancialProducts().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          expect(consoleSpy).toHaveBeenCalled();
          consoleSpy.mockRestore();
          done();
        }
      });
    });
  });

  describe('createFinancialProduct', () => {
    it('should create a financial product', (done) => {
      const expectedResponse = { success: true };
      httpServiceMock.post.mockReturnValue(of(expectedResponse));

      service.createFinancialProduct(mockProduct).subscribe({
        next: (response) => {
          expect(response).toEqual(expectedResponse);
          expect(httpServiceMock.post).toHaveBeenCalledWith(
            `${environment.apiUrl}/bp/products`,
            mockProduct
          );
          done();
        }
      });
    });

    it('should handle error when creation fails', (done) => {
      const errorMessage = 'Creation failed';
      httpServiceMock.post.mockReturnValue(throwError(() => new Error(errorMessage)));

      service.createFinancialProduct(mockProduct).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        }
      });
    });
  });

  describe('updateFinancialProduct', () => {
    it('should update a financial product', (done) => {
      const expectedResponse = { success: true };
      httpServiceMock.put.mockReturnValue(of(expectedResponse));

      service.updateFinancialProduct(mockProduct).subscribe({
        next: (response) => {
          expect(response).toEqual(expectedResponse);
          expect(httpServiceMock.put).toHaveBeenCalledWith(
            `${environment.apiUrl}/bp/products/${mockProduct.id}`,
            mockProduct
          );
          done();
        }
      });
    });

    it('should handle error when update fails', (done) => {
      const errorMessage = 'Update failed';
      httpServiceMock.put.mockReturnValue(throwError(() => new Error(errorMessage)));

      service.updateFinancialProduct(mockProduct).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        }
      });
    });
  });

  describe('deleteFinancialProduct', () => {
    it('should delete a financial product', (done) => {
      const expectedResponse = { success: true };
      httpServiceMock.delete.mockReturnValue(of(expectedResponse));

      service.deleteFinancialProduct(mockProduct.id).subscribe({
        next: (response) => {
          expect(response).toEqual(expectedResponse);
          expect(httpServiceMock.delete).toHaveBeenCalledWith(
            `${environment.apiUrl}/bp/products/${mockProduct.id}`
          );
          done();
        }
      });
    });

    it('should handle error when deletion fails', (done) => {
      const errorMessage = 'Deletion failed';
      httpServiceMock.delete.mockReturnValue(throwError(() => new Error(errorMessage)));

      service.deleteFinancialProduct(mockProduct.id).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        }
      });
    });
  });
});
