import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  confirmText = 'Continue';
  cancelText = 'Cancel';
  mainText = 'Unsaved progress';
  title = 'Are you sure?';
  confirmBtnColor = 'warn';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { confirmText: string, cancelText: string, mainText: string, title: string, confirmBtnColor: 'warn' | 'accent' | 'primary' | '' }) {
      this.confirmText = data.confirmText ? data.confirmText : this.confirmText;
      this.cancelText = data.cancelText ? data.cancelText : this.cancelText;
      this.mainText = data.mainText ? data.mainText : this.mainText;
      this.title = data.title ? data.title : this.title;
      this.confirmBtnColor = data.confirmBtnColor ? data.confirmBtnColor : this.confirmBtnColor;
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  closeDialogConfirm() {
    this.dialogRef.close(true);
  }
}
