import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../core/models/models';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{ data.category ? 'Edit' : 'New' }} Category</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display:flex;flex-direction:column;gap:4px;min-width:320px;padding-top:8px">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            <mat-option value="INCOME">Income</mat-option>
            <mat-option value="EXPENSE">Expense</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Color</mat-label>
          <mat-select formControlName="color">
            @for (c of colors; track c) {
              <mat-option [value]="c">
                <span style="display:inline-block;width:16px;height:16px;border-radius:4px;margin-right:8px;vertical-align:middle" [style.background]="c"></span>{{ c }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Icon (Material icon name)</mat-label>
          <input matInput formControlName="icon" placeholder="e.g. home, restaurant" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" (click)="submit()" [disabled]="loading || form.invalid">
        {{ data.category ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `
})
export class CategoryDialogComponent {
  form: FormGroup;
  loading = false;
  colors = ['#6366f1','#22c55e','#f97316','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#06b6d4','#84cc16'];

  constructor(private fb: FormBuilder, private api: ApiService,
              private dialogRef: MatDialogRef<CategoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { category?: Category }) {
    const c = data.category;
    this.form = this.fb.group({
      name: [c?.name || '', Validators.required],
      type: [c?.type || 'EXPENSE', Validators.required],
      color: [c?.color || '#6366f1'],
      icon: [c?.icon || 'category']
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const obs = this.data.category
      ? this.api.updateCategory(this.data.category.id, this.form.value)
      : this.api.createCategory(this.form.value);
    obs.subscribe({ next: c => this.dialogRef.close(c), error: () => { this.loading = false; } });
  }
}
