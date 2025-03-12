import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialProduct } from '../../domain/models/financial-product.model';
import { CommonHttpService } from './common-http.service';
import {environment} from '../../../eviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class FinancialProductApiService {
  private apiUrl = environment.apiUrl;

  constructor(private httpService: CommonHttpService) {}

  getFinancialProducts(): Observable<FinancialProduct[]> {
    return this.httpService.get<FinancialProduct[]>(`${this.apiUrl}/bp/products`);
  }

  createFinancialProduct(product: FinancialProduct): Observable<any> {
    return this.httpService.post<any>(`${this.apiUrl}/bp/products`, product);
  }

  updateFinancialProduct(product: FinancialProduct): Observable<any> {
    return this.httpService.put<any>(`${this.apiUrl}/bp/products/${product.id}`, product);
  }

  deleteFinancialProduct(productId: string): Observable<any> {
    return this.httpService.delete<any>(`${this.apiUrl}/bp/products/${productId}`);
  }
}
