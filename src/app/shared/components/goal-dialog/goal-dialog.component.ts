import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Goal } from '../../../core/models/models';
import { ApiService } from '../../../core/services/api.service';

export interface GoalDialogData { goal?: Goal; depositMode?: boolean; }

@Component({
  selector: 'app-goal-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './goal-dialog.component.html',
  styleUrl: './goal-dialog.component.scss'
})
export class GoalDialogComponent {
  form: FormGroup;
  loading = false;

  colors = ['#6366f1','#22c55e','#f97316','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#06b6d4'];
  icons = ['savings','home','directions_car','flight_takeoff','school','fitness_center','restaurant','laptop_mac','beach_access'];

  constructor(private fb: FormBuilder, private api: ApiService,
              private dialogRef: MatDialogRef<GoalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: GoalDialogData) {
    if (data.depositMode) {
      this.form = this.fb.group({ amount: ['', [Validators.required, Validators.min(0.01)]] });
    } else {
      const g = data.goal;
      this.form = this.fb.group({
        name: [g?.name || '', Validators.required],
        description: [g?.description || ''],
        targetAmount: [g?.targetAmount || '', [Validators.required, Validators.min(1)]],
        currentAmount: [g?.currentAmount || 0],
        color: [g?.color || '#6366f1'],
        icon: [g?.icon || 'savings'],
        deadline: [g?.deadline ? new Date(g.deadline) : null]
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const val = this.form.value;

    if (this.data.depositMode && this.data.goal) {
      this.api.depositGoal(this.data.goal.id, val.amount).subscribe({
        next: (g) => this.dialogRef.close(g),
        error: () => { this.loading = false; }
      });
      return;
    }

    const payload = { ...val };
    if (payload.deadline instanceof Date) payload.deadline = payload.deadline.toISOString().split('T')[0];

    const obs = this.data.goal
      ? this.api.updateGoal(this.data.goal.id, payload)
      : this.api.createGoal(payload);

    obs.subscribe({
      next: (g) => this.dialogRef.close(g),
      error: () => { this.loading = false; }
    });
  }
}
