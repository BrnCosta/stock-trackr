import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StockService } from '../services/stock.service';
import { DialogAddProduct } from '../utils/dialog-add-product/dialog-add-product.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirm } from '../utils/dialog-confirm/dialog-confirm.component';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogSale } from '../utils/dialog-sale/dialog-sale.component';
import { Product } from '../interfaces/Product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class HomeComponent implements OnInit {

  constructor(
    private stockService: StockService,
    private alert: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getAllStockProducts();
  }

  displayedColumns: string[] = ['select', 'name', 'description', 'price', 'tax', 'quantity', 'edit', 'delete'];
  selection = new SelectionModel<Product>(true, []);

  allProducts: Product[] = [];
  products: Product[] = [];
  searchText = "";

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.products.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.products);
  }

  checkboxLabel(row?: Product): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }

  getAllStockProducts() {
    this.stockService.getAllStockProducts().subscribe((products: Product[]) => {
      this.allProducts = products;
      this.products = products;
    })
  }

  applyFilter() {
    this.products = this.allProducts.filter((product: Product) => product.name.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  resetSearch() {
    this.searchText = '';
    this.applyFilter();
  }

  openAlert(text: string) {
    this.alert.open(text, "X", {
      duration: 3000
    });
  }

  openSaleDialog() {
    if (this.selection.selected.length == 0) {
      this.openAlert("Please select at least one product...");
      return;
    }

    const dialogRef = this.dialog.open(DialogSale, {
      data: this.selection.selected,
    });

    dialogRef.afterClosed().subscribe({
      next: () => this.getAllStockProducts()
    });
  }

  deleteProduct(product: Product): void {
    const confirmText = `Would you like to remove ${product.name} from stock?`;
    this.openConfirmDialog('Remove product', confirmText).then(confirm => {
      if (confirm) {
        this.stockService.removeProduct(product).subscribe({
          next: () => {
            this.openAlert('Product successfully removed!');
            this.getAllStockProducts();
          },
          error: (e: Error) => this.openAlert('Error removing product: ' + e)
        });
      }
    }
    );
  }

  openUpdateDialog(product: Product): void {
    const dialogRef = this.dialog.open(DialogAddProduct, {
      data: product,
    });

    dialogRef.afterClosed().subscribe((result: Product | undefined) => {
      if (result == undefined)
        return;

      this.stockService.updateProduct(result)
        .subscribe({
          next: () => {
            this.openAlert('Product successfully updated!');
            this.getAllStockProducts();
          },
          error: (e: Error) => this.openAlert('Error updating product: ' + e)
        });
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(DialogAddProduct);

    dialogRef.afterClosed().subscribe((result: Product | undefined) => {
      if (result == undefined)
        return;

      this.stockService.addProduct(result)
        .subscribe({
          next: (product: Product) => {
            this.openAlert('Successfully added product: ' + product.name);
            this.getAllStockProducts();
          },
          error: (e: Error) => this.openAlert('Error adding product: ' + e)
        });
    });
  }

  async openConfirmDialog(title: string, text: string): Promise<boolean> {
    const dialogRef = this.dialog.open(DialogConfirm, {
      data: { title, text },
    });

    var result = await firstValueFrom(dialogRef.afterClosed());
    return result;
  }
}
