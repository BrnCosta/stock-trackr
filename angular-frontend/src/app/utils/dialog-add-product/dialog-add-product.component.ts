import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, Inject } from '@angular/core';
import { Product } from '../../interfaces/Product';

@Component({
    selector: 'dialog-add-product',
    templateUrl: 'dialog-add-product.html',
    standalone: true,
    imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, NgIf],
})

export class DialogAddProduct {
    constructor(
        public dialogRef: MatDialogRef<DialogAddProduct>,
        @Inject(MAT_DIALOG_DATA) public data: Product
    ) {
        if (this.data != null) {
            this.productForm = new FormGroup({
                name: new FormControl({ value: data.name, disabled: true }),
                description: new FormControl(data.description),
                price: new FormControl(data.price, [Validators.required, Validators.min(1)]),
                tax: new FormControl(data.tax, [Validators.required, Validators.min(0)]),
                quantity: new FormControl(data.quantity, [Validators.required, Validators.min(0)])
            });
        }
    }

    onNoClick(): void {
        this.dialogRef.close(undefined);
    }

    productForm: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        description: new FormControl(''),
        price: new FormControl('', [Validators.required, Validators.min(1)]),
        tax: new FormControl('', [Validators.required, Validators.min(0)]),
        quantity: new FormControl(0, [Validators.required, Validators.min(0)])
    });

    onSubmit() {
        if (this.productForm.valid && !this.productForm.pristine) {
            this.productForm.controls['name'].enable();
            this.dialogRef.close(this.productForm.value);
        }
    }
}