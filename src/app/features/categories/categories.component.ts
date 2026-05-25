import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../core/services/api.service';
import { Category } from '../../core/models/models';
import { CategoryDialogComponent } from '../../shared/components/category-dialog/category-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatChipsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = false;

  constructor(private api: ApiService, private dialog: MatDialog, private snack: MatSnackBar) {}

  ngOnInit(): void { this.loadCategories(); }

  loadCategories(): void {
    this.loading = true;
    this.api.getCategories().subscribe({
      next: c => { this.categories = c; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get incomeCategories(): Category[] { return this.categories.filter(c => c.type === 'INCOME'); }
  get expenseCategories(): Category[] { return this.categories.filter(c => c.type === 'EXPENSE'); }

  openDialog(category?: Category): void {
    const ref = this.dialog.open(CategoryDialogComponent, { data: { category }, width: '380px' });
    ref.afterClosed().subscribe(result => {
      if (result) { this.loadCategories(); this.snack.open(category ? 'Category updated' : 'Category created', 'Close', { duration: 2500 }); }
    });
  }

  delete(category: Category): void {
    if (!confirm(`Delete category "${category.name}"? Transactions using it may be affected.`)) return;
    this.api.deleteCategory(category.id).subscribe({
      next: () => { this.categories = this.categories.filter(c => c.id !== category.id); this.snack.open('Category deleted', 'Close', { duration: 2500 }); },
      error: (err) => this.snack.open(err.error?.error || 'Cannot delete category', 'Close', { duration: 3000 })
    });
  }
}
