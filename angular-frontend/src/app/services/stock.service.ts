import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../interfaces/Product';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private url = 'http://localhost:8080/stock';

  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    body: ""
  }

  getAllStockProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.url)
      .pipe(
        catchError(this.handleError)
      )
  }

  addProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.url, JSON.stringify(product), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  removeProduct(product: Product): Observable<boolean> {
    this.httpOptions.body = JSON.stringify(product);

    return this.httpClient.delete<boolean>(this.url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  updateProduct(product: Product): Observable<boolean> {
    return this.httpClient.put<boolean>(this.url, JSON.stringify(product), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  handleError(response: HttpErrorResponse) {
    var errorMessage = `Error code: ${response.status}, ` + `message: ${response.error}`;
    return throwError(() => new Error(errorMessage));
  };
}
