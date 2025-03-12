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

  describe('getFinancialProductById', () => {
    it('should return a single financial product', (done) => {
      httpServiceMock.get.mockReturnValue(of(mockProduct));

      service.getFinancialProductById('1').subscribe({
        next: (product) => {
          expect(product).toEqual(mockProduct);
          expect(httpServiceMock.get).toHaveBeenCalledWith(`${environment.apiUrl}/bp/products/1`);
          done();
        }
      });
    });

    it('should handle error when getting single product fails', (done) => {
      httpServiceMock.get.mockReturnValue(throwError(() => new Error('Error')));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      service.getFinancialProductById('1').subscribe({
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
  });

  describe('updateFinancialProduct', () => {
    it('should update a financial product', (done) => {
      const expectedResponse = { success: true };
      const updateData = { name: 'Updated Product' };
      httpServiceMock.put.mockReturnValue(of(expectedResponse));

      service.updateFinancialProduct(updateData, '1').subscribe({
        next: (response) => {
          expect(response).toEqual(expectedResponse);
          expect(httpServiceMock.put).toHaveBeenCalledWith(
            `${environment.apiUrl}/bp/products/1`,
            updateData
          );
          done();
        }
      });
    });
  });

  describe('deleteFinancialProduct', () => {
    it('should delete a financial product', (done) => {
      const expectedResponse = { success: true };
      httpServiceMock.delete.mockReturnValue(of(expectedResponse));

      service.deleteFinancialProduct('1').subscribe({
        next: (response) => {
          expect(response).toEqual(expectedResponse);
          expect(httpServiceMock.delete).toHaveBeenCalledWith(
            `${environment.apiUrl}/bp/products/1`
          );
          done();
        }
      });
    });
  });

  describe('verificationId', () => {
    it('should return true when ID is valid', (done) => {
      httpServiceMock.get.mockReturnValue(of(true));

      service.verificationId('1').subscribe({
        next: (result) => {
          expect(result).toBe(true);
          expect(httpServiceMock.get).toHaveBeenCalledWith(
            `${environment.apiUrl}/bp/products/verification/1`
          );
          done();
        }
      });
    });

    it('should return false when verification fails', (done) => {
      httpServiceMock.get.mockReturnValue(throwError(() => new Error('Error')));

      service.verificationId('1').subscribe({
        next: (result) => {
          expect(result).toBe(false);
          expect(httpServiceMock.get).toHaveBeenCalledWith(
            `${environment.apiUrl}/bp/products/verification/1`
          );
          done();
        }
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null productId in getFinancialProductById', (done) => {
      httpServiceMock.get.mockReturnValue(of(mockProduct));

      service.getFinancialProductById(null).subscribe({
        next: (product) => {
          expect(product).toEqual(mockProduct);
          expect(httpServiceMock.get).toHaveBeenCalledWith(`${environment.apiUrl}/bp/products/null`);
          done();
        }
      });
    });

    it('should handle null id in updateFinancialProduct', (done) => {
      const updateData = { name: 'Updated Product' };
      httpServiceMock.put.mockReturnValue(of({ success: true }));

      service.updateFinancialProduct(updateData, null).subscribe({
        next: (response) => {
          expect(response).toEqual({ success: true });
          expect(httpServiceMock.put).toHaveBeenCalledWith(
            `${environment.apiUrl}/bp/products/null`,
            updateData
          );
          done();
        }
      });
    });
  });
});
