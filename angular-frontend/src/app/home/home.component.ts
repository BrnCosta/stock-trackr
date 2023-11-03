import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StockService } from './stock.service';

export interface Product {
  name: string;
  description: string;
  price: number;
  quantity: number;
  tax: number;
}

const STOCK_DATA: Product[] = [
  { name: "Product", description: 'Hydrogen', price: 1.0079, quantity: 10, tax: 0.01 },
  { name: "Product", description: 'Hydrogen', price: 1.0079, quantity: 10, tax: 0.01 },
  { name: "Product", description: 'Hydrogen', price: 1.0079, quantity: 10, tax: 0.01 },
  { name: "Product", description: 'Hydrogen', price: 1.0079, quantity: 10, tax: 0.01 },
  { name: "Product", description: 'Hydrogen', price: 1.0079, quantity: 10, tax: 0.01 },
  { name: "Product", description: 'Hydrogen', price: 1.0079, quantity: 10, tax: 0.01 },
  { name: "Product", description: 'Hydrogen', price: 1.0079, quantity: 10, tax: 0.01 },
  { name: "Product", description: 'Hydrogen', price: 1.0079, quantity: 10, tax: 0.01 },
  { name: "Product", description: 'Hydrogen', price: 1.0079, quantity: 10, tax: 0.01 },
  { name: "Product", description: 'Hydrogen', price: 1.0079, quantity: 10, tax: 0.01 },
  { name: "Product", description: 'Hydrogen', price: 1.0079, quantity: 10, tax: 0.01 },
  { name: "Product", description: 'Hydrogen', price: 1.0079, quantity: 10, tax: 0.01 },
  { name: "Product", description: 'Hydrogen', price: 1.0079, quantity: 10, tax: 0.01 },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class HomeComponent implements OnInit {

  constructor(private stockService: StockService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllStockProducts();
  }

  displayedColumns: string[] = ['name', 'description', 'price', 'tax', 'quantity'];
  products: Product[] = [];
  searchText = "";

  getAllStockProducts() {
    this.stockService.getAllStockProducts().subscribe((products: Product[]) => {
      this.products = products;
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddProduct);

    dialogRef.afterClosed().subscribe(result => {
      if(result == undefined)
        return;
      
      this.stockService.addProduct(result)
        .subscribe({
          next: (product: Product) => {
            console.log('Successfully added product: ' + product.name);
            this.products = [...this.products, product];
          },
          error: (e: Error) => console.error('Error adding product: ' + e)
        })
    });
  }
}

import { MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'dialog-add-product',
  templateUrl: 'dialog-add-product.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, NgIf],
})
export class DialogAddProduct {
  constructor(
    public dialogRef: MatDialogRef<DialogAddProduct>
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
    tax: new FormControl('', [Validators.required, Validators.min(0)]),
    quantity: new FormControl(0, [Validators.required, Validators.min(0)])
  });

  onSubmit() {
    this.dialogRef.close(this.productForm.value);
  }
}
