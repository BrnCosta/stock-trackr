import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Sale } from '../interfaces/Sale';
import { Checkout } from '../interfaces/Checkout';

@Injectable({
    providedIn: 'root'
})
export class SaleService {

    private url = 'http://localhost:8080/sale';

    constructor(private httpClient: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        body: ""
    }

    createSale(sale: Sale): Observable<void> {
        return this.httpClient.post<void>(this.url, JSON.stringify(sale), this.httpOptions)
            .pipe(
                catchError(this.handleError)
            )
    }

    checkoutSale(checkout: Checkout): Observable<Sale> {
        return this.httpClient.put<Sale>(this.url, JSON.stringify(checkout), this.httpOptions)
            .pipe(
                catchError(this.handleError)
            )
    }

    handleError(response: HttpErrorResponse) {
        var errorMessage = `Error code: ${response.status}, ` + `message: ${response.error}`;
        return throwError(() => new Error(errorMessage));
    };
}
