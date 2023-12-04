import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { StockService } from '../services/stock.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Product } from '../interfaces/Product';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let stockService: jasmine.SpyObj<StockService>;
  let matDialog: MatDialog;

  beforeEach(() => {
    stockService = jasmine.createSpyObj('StockService', ['getAllStockProducts', 'addProduct']);
    matDialog = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [FormsModule, MatFormFieldModule, MatIconModule,
        BrowserModule, BrowserAnimationsModule, NgIf, FormsModule,
        MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule,
        MatIconModule, MatCardModule, MatPaginatorModule, MatDialogModule,
        HttpClientModule],
      providers: [
        { provide: StockService, useValue: stockService },
        MatDialog,
        MatSnackBar
      ]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have Stock Trackr title', () => {
    stockService.getAllStockProducts.and.returnValue(of([]));

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.container h1')?.textContent)
      .toContain('Stock Trackr');
  })

  it('should have a button to add a Product', () => {
    stockService.getAllStockProducts.and.returnValue(of([]));

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#productBtn')?.textContent)
      .toContain('Add Product');
  })

  it('should have called getAllStockProducts at the beggining', fakeAsync(() => {
    const spyAllStockProduct = spyOn(fixture.componentInstance, 'getAllStockProducts');
    stockService.getAllStockProducts.and.returnValue(of([]));

    fixture.detectChanges();

    tick();

    expect(spyAllStockProduct).toHaveBeenCalledTimes(1);
  }))

  it('should trigger open modal when addProduct clicked', fakeAsync(() => {
    const spyOpenDialog = spyOn(fixture.componentInstance, 'openAddDialog');

    stockService.getAllStockProducts.and.returnValue(of([]));

    fixture.detectChanges();

    let addProduct = fixture.debugElement.nativeElement.querySelector('#productBtn');
    addProduct.click();

    tick();

    expect(spyOpenDialog).toHaveBeenCalledTimes(1);
  }));

  it('should display headers in table', fakeAsync(() => {

    stockService.getAllStockProducts.and.returnValue(of([]));

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('table thead .mat-column-name')?.textContent)
      .toContain(' Name ');

    expect(compiled.querySelector('table thead .mat-column-description')?.textContent)
      .toContain(' Description ');

    expect(compiled.querySelector('table thead .mat-column-price')?.textContent)
      .toContain(' Price ');

    expect(compiled.querySelector('table thead .mat-column-tax')?.textContent)
      .toContain(' Tax ');

    expect(compiled.querySelector('table thead .mat-column-quantity')?.textContent)
      .toContain(' Quantity ');
  }));

  it('should display product in table', fakeAsync(() => {
    const product: Product = {
      name: 'Test',
      description: '',
      price: 0,
      tax: 0,
      quantity: 0
    }

    stockService.getAllStockProducts.and.returnValue(of([product]));

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('table tbody .mat-column-name')?.textContent)
      .toContain('Test');
  }));

  it('should show title when modal is opened', fakeAsync(() => {
    stockService.getAllStockProducts.and.returnValue(of([]));

    fixture.detectChanges();

    let addProduct = fixture.debugElement.nativeElement.querySelector('#productBtn');
    addProduct.click();

    fixture.whenStable().then(() => {
      const h1InDialog = document.querySelector('#dialogTitle');
      expect(h1InDialog?.textContent).toBe('New product');
    });

    flush();
  }));

  it('should show save button when modal is opened', fakeAsync(() => {
    stockService.getAllStockProducts.and.returnValue(of([]));

    fixture.detectChanges();

    let addProduct = fixture.debugElement.nativeElement.querySelector('#productBtn');
    addProduct.click();

    fixture.whenStable().then(() => {
      const cancelDialog = document.querySelector('#cancelBtn');
      expect(cancelDialog?.textContent).toBe('Cancel');

      const saveDialog = document.querySelector('#saveBtn');
      expect(saveDialog?.textContent).toBe('Save');
    });

    flush();
  }));
});

