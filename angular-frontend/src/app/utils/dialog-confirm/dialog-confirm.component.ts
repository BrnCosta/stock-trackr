import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogModule,
} from '@angular/material/dialog';

export interface ConfirmData {
    title: string;
    text: string;
}

@Component({
    selector: 'dialog-confirm',
    templateUrl: 'dialog-confirm.html',
    standalone: true,
    imports: [MatDialogModule, MatInputModule, MatButtonModule],
})

export class DialogConfirm {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirm>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmData,
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}