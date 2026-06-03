import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Category, Transaction, TransactionFilter } from '../../core/models/models';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  categories: Category[] = [];
  loading = false;

  showForm = false;
  editingId: number | null = null;

  // Reactive Forms (session 6)
  form: FormGroup;
  filterForm: FormGroup;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.form = this.fb.group({
      type: ['EXPENSE', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      categoryId: [null, Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      description: ['']
    });

    this.filterForm = this.fb.group({
      search: [''],
      type: [''],
      categoryId: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactions();
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
    if (v.startDate) filter.startDate = v.startDate;
    if (v.endDate) filter.endDate = v.endDate;

    this.api.getTransactions(filter).subscribe({
      next: (data) => { this.transactions = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  // Catégories filtrées selon le type choisi dans le formulaire
  get formCategories(): Category[] {
    return this.categories.filter(c => c.type === this.form.value.type);
  }

  openCreate(): void {
    this.editingId = null;
    this.form.reset({ type: 'EXPENSE', amount: null, categoryId: null,
      date: new Date().toISOString().substring(0, 10), description: '' });
    this.showForm = true;
  }

  openEdit(t: Transaction): void {
    this.editingId = t.id;
    this.form.reset({
      type: t.type, amount: t.amount, categoryId: t.categoryId,
      date: t.date, description: t.description
    });
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editingId = null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value;
    const request = this.editingId
      ? this.api.updateTransaction(this.editingId, payload)
      : this.api.createTransaction(payload);

    request.subscribe(() => {
      this.showForm = false;
      this.editingId = null;
      this.loadTransactions();
    });
  }

  delete(t: Transaction): void {
    if (!confirm(`Supprimer cette transaction de ${t.amount} € ?`)) return;
    this.api.deleteTransaction(t.id).subscribe(() => this.loadTransactions());
  }

  clearFilters(): void {
    this.filterForm.reset({ search: '', type: '', categoryId: '', startDate: '', endDate: '' });
    this.loadTransactions();
  }

  // Téléchargement du CSV (réponse Blob via HttpClient)
  exportCsv(): void {
    this.api.exportTransactions().subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Accesseurs pour la validation dans le HTML (session 6)
  get amount() { return this.form.controls['amount']; }
  get categoryId() { return this.form.controls['categoryId']; }
}
