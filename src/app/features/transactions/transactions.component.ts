import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../core/services/api.service';
import { Category, Transaction, TransactionFilter } from '../../core/models/models';
import { TransactionDialogComponent } from '../../shared/components/transaction-dialog/transaction-dialog.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatChipsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  categories: Category[] = [];
  loading = false;
  filterForm: FormGroup;

  constructor(private api: ApiService, private dialog: MatDialog,
              private snack: MatSnackBar, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      type: [''],
      categoryId: [''],
      startDate: [null],
      endDate: [null],
      minAmount: [''],
      maxAmount: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactions();
    this.filterForm.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.loadTransactions());
  }

  loadCategories(): void {
    this.api.getCategories().subscribe(c => this.categories = c);
  }

  loadTransactions(): void {
    this.loading = true;
    const v = this.filterForm.value;
    const filter: TransactionFilter = {};
    if (v.search) filter.search = v.search;
    if (v.type) filter.type = v.type;
    if (v.categoryId) filter.categoryId = v.categoryId;
    if (v.startDate) filter.startDate = (v.startDate as Date).toISOString().split('T')[0];
    if (v.endDate) filter.endDate = (v.endDate as Date).toISOString().split('T')[0];
    if (v.minAmount) filter.minAmount = v.minAmount;
    if (v.maxAmount) filter.maxAmount = v.maxAmount;

    this.api.getTransactions(filter).subscribe({
      next: (t) => { this.transactions = t; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openDialog(transaction?: Transaction): void {
    const ref = this.dialog.open(TransactionDialogComponent, {
      data: { transaction, categories: this.categories },
      width: '460px'
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
        this.snack.open(transaction ? 'Transaction updated' : 'Transaction added', 'Close', { duration: 2500 });
      }
    });
  }

  delete(t: Transaction): void {
    if (!confirm(`Delete this transaction of $${t.amount}?`)) return;
    this.api.deleteTransaction(t.id).subscribe({
      next: () => {
        this.transactions = this.transactions.filter(x => x.id !== t.id);
        this.snack.open('Transaction deleted', 'Close', { duration: 2500 });
      }
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  formatCurrency(v: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
  }
}
