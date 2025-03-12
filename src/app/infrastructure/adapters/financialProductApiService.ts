import {Injectable} from '@angular/core';
import {map, Observable, of, throwError} from 'rxjs';
import {FinancialProduct} from '../../domain/models/financial-product.model';
import {CommonHttpService} from './common-http.service';
import {environment} from '../../../eviroments/enviroment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FinancialProductApiService {
  private apiUrl = environment.apiUrl;

  constructor(private httpService: CommonHttpService) {
  }

  getFinancialProducts(): Observable<FinancialProduct[]> {
    return this.httpService.get<{ data: FinancialProduct[] }>(`${this.apiUrl}/bp/products`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error al obtener los productos', error);
        return throwError(() => error);
      })
    );
  }

  getFinancialProductById(productId: string | null): Observable<FinancialProduct> {
    return this.httpService.get<FinancialProduct>(`${this.apiUrl}/bp/products/${productId}`).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error al obtener el producto', error);
        return throwError(() => error);
      })
    );

  }

  createFinancialProduct(product: FinancialProduct): Observable<any> {
    return this.httpService.post<any>(`${this.apiUrl}/bp/products`, product);
  }

  updateFinancialProduct(data: any, id: string | null): Observable<any> {
    return this.httpService.put<any>(`${this.apiUrl}/bp/products/${id}`, data);
  }

  deleteFinancialProduct(productId: string): Observable<any> {
    return this.httpService.delete<any>(`${this.apiUrl}/bp/products/${productId}`);
  }

  verificationId(id: string): Observable<boolean> {
    return this.httpService.get<boolean>(`${this.apiUrl}/bp/products/verification/${id}`).pipe(
      map(response => response),
      catchError(() => of(false))
    );
  }

}
