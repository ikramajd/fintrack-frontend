import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Category } from '../../core/models/models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = false;

  showForm = false;
  editingId: number | null = null;
  form: FormGroup;

  // Grande palette de couleurs nommées
  colors = [
    { name: 'Indigo',     hex: '#6366f1' },
    { name: 'Bleu',       hex: '#3b82f6' },
    { name: 'Bleu ciel',  hex: '#0ea5e9' },
    { name: 'Cyan',       hex: '#06b6d4' },
    { name: 'Turquoise',  hex: '#14b8a6' },
    { name: 'Émeraude',   hex: '#10b981' },
    { name: 'Vert',       hex: '#22c55e' },
    { name: 'Citron',     hex: '#84cc16' },
    { name: 'Jaune',      hex: '#eab308' },
    { name: 'Ambre',      hex: '#f59e0b' },
    { name: 'Orange',     hex: '#f97316' },
    { name: 'Rouge',      hex: '#ef4444' },
    { name: 'Rose',       hex: '#ec4899' },
    { name: 'Fuchsia',    hex: '#d946ef' },
    { name: 'Violet',     hex: '#8b5cf6' },
    { name: 'Pourpre',    hex: '#a855f7' },
    { name: 'Ardoise',    hex: '#64748b' },
    { name: 'Gris',       hex: '#6b7280' }
  ];

  // Sélecteur d'icônes (noms Bootstrap Icons)
  icons = [
    'cart', 'house', 'car-front', 'controller', 'heart-pulse', 'bag',
    'cash-stack', 'briefcase', 'cup-hot', 'airplane', 'book', 'phone',
    'lightning', 'gift', 'piggy-bank', 'credit-card', 'basket', 'tag'
  ];

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['EXPENSE', Validators.required],
      color: ['#6366f1'],
      icon: ['tag'],
      monthlyBudget: [null]
    });
  }

  // Sélection visuelle : on met à jour le FormControl (session 6)
  selectColor(hex: string): void { this.form.controls['color'].setValue(hex); }
  selectIcon(icon: string): void { this.form.controls['icon'].setValue(icon); }

  get selectedColor(): string { return this.form.value.color; }
  get selectedIcon(): string { return this.form.value.icon; }
  get selectedColorName(): string {
    return this.colors.find(c => c.hex === this.selectedColor)?.name ?? '';
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getCategories().subscribe({
      next: (c) => { this.categories = c; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get incomeCategories(): Category[] { return this.categories.filter(c => c.type === 'INCOME'); }
  get expenseCategories(): Category[] { return this.categories.filter(c => c.type === 'EXPENSE'); }

  openCreate(): void {
    this.editingId = null;
    this.form.reset({ name: '', type: 'EXPENSE', color: '#6366f1', icon: 'tag', monthlyBudget: null });
    this.showForm = true;
  }

  openEdit(c: Category): void {
    this.editingId = c.id;
    this.form.reset({
      name: c.name, type: c.type, color: c.color || '#6366f1',
      icon: c.icon || 'tag', monthlyBudget: c.monthlyBudget ?? null
    });
    this.showForm = true;
  }

  cancel(): void { this.showForm = false; this.editingId = null; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.value;
    const request = this.editingId
      ? this.api.updateCategory(this.editingId, payload)
      : this.api.createCategory(payload);
    request.subscribe(() => { this.showForm = false; this.editingId = null; this.load(); });
  }

  delete(c: Category): void {
    if (!confirm(`Supprimer la catégorie "${c.name}" ?`)) return;
    this.api.deleteCategory(c.id).subscribe({
      next: () => this.load(),
      error: () => alert('Impossible de supprimer : des transactions utilisent peut-être cette catégorie.')
    });
  }

  get name() { return this.form.controls['name']; }
}
