import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Category, Transaction, TransactionType } from '../../../core/models/models';
import { ApiService } from '../../../core/services/api.service';

export interface TransactionDialogData {
  transaction?: Transaction;
  categories: Category[];
}

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatIconModule],
  templateUrl: './transaction-dialog.component.html',
  styleUrl: './transaction-dialog.component.scss'
})
export class TransactionDialogComponent implements OnInit {
  form: FormGroup;
  loading = false;
  filteredCategories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionDialogData
  ) {
    const t = data.transaction;
    this.form = this.fb.group({
      type: [t?.type || 'EXPENSE', Validators.required],
      amount: [t?.amount || '', [Validators.required, Validators.min(0.01)]],
      categoryId: [t?.categoryId || '', Validators.required],
      description: [t?.description || ''],
      date: [t?.date ? new Date(t.date) : new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.filterCategories();
    this.form.get('type')?.valueChanges.subscribe(() => {
      this.filterCategories();
      this.form.get('categoryId')?.reset();
    });
  }

  filterCategories(): void {
    const type: TransactionType = this.form.get('type')?.value;
    this.filteredCategories = this.data.categories.filter(c => c.type === type);
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const val = this.form.value;
    const date = val.date instanceof Date ? val.date.toISOString().split('T')[0] : val.date;
    const payload = { ...val, date };

    const obs = this.data.transaction
      ? this.api.updateTransaction(this.data.transaction.id, payload)
      : this.api.createTransaction(payload);

    obs.subscribe({
      next: (t) => this.dialogRef.close(t),
      error: () => { this.loading = false; }
    });
  }
}
