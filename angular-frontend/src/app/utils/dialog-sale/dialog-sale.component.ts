import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, Inject } from '@angular/core';
import { Product } from '../../interfaces/Product';
import { MatRadioModule } from '@angular/material/radio';
import { SaleService } from 'src/app/services/sale.service';
import { Sale } from '../../interfaces/Sale';
import { Checkout } from 'src/app/interfaces/Checkout';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'dialog-sale',
    templateUrl: 'dialog-sale.html',
    styleUrls: ['dialog-sale.component.css'],
    standalone: true,
    imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, NgIf, NgFor, MatRadioModule],
})

export class DialogSale {

    products: Product[] = [];
    saleForm: FormGroup;
    paymentType: Number = 0;
    paymentValid: boolean = false;
    cashAmount: Number = 0;
    totalAmount: Number = 0;

    constructor(
        private saleService: SaleService,
        public dialogRef: MatDialogRef<DialogSale>,
        private formBuilder: FormBuilder,
        private alert: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public dataProd: Product[]
    ) {
        this.products = dataProd;

        this.saleForm = new FormGroup({
            formArrayName: this.formBuilder.array([])
        })

        this.buildForm();
    }

    buildForm() {
        const controlArray = this.saleForm.get('formArrayName') as FormArray;

        Object.keys(this.products).forEach((i) => {
            controlArray.push(
                this.formBuilder.group({
                    name: new FormControl(this.products[parseInt(i)].name),
                    price: new FormControl(this.products[parseInt(i)].price),
                    quantity: new FormControl(0)
                })
            )
        });
    }

    openAlert(text: string) {
        this.alert.open(text, "X", {
            duration: 3000
        });
    }

    updateAmount() {
        const formArray = this.saleForm.get('formArrayName') as FormArray;
        var totalPrice = 0;

        formArray.controls.forEach(control => {
            var tax = this.products.find(p => p.name === control.value.name)?.tax;
            if (tax == undefined)
                tax = 0
            totalPrice += (control.value.price * (1 + tax)) * control.value.quantity;
        })

        this.totalAmount = totalPrice;
    }

    onSubmit() {
        // Here I would like to be able to access the values of the 'forms'
        console.log(this.paymentType);

        var sale: Sale = ({
            products: [],
            quantity: [],
            change: 0,
            date: new Date,
            sold: false,
            totalAmount: 0
        });

        const formArray = this.saleForm.get('formArrayName') as FormArray;
        formArray.controls.forEach(control => {
            var productName = control.value.name;
            var quantity = control.value.quantity;

            sale.products.push(productName);
            sale.quantity.push(quantity);
        })

        this.saleService.createSale(sale).subscribe({
            next: () => {
                var payment = this.totalAmount;

                if (this.paymentType == 1)
                    payment = this.cashAmount;

                var checkout: Checkout = ({
                    paymentType: this.paymentType,
                    paymentValue: payment
                })

                this.saleService.checkoutSale(checkout).subscribe({
                    next: (sale) => {
                        if (this.paymentType == 1)
                            this.openAlert('Sale confirmed! Change: ' + sale.change);
                        else
                            this.openAlert('Sale confirmed!');

                        this.dialogRef.close(undefined);
                    }
                })
            },
            error: (e: Error) => this.openAlert('Error removing product: ' + e)
        })
    }

    onNoClick() {
        this.dialogRef.close(undefined);
    }
}