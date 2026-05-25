import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../core/services/api.service';
import { Goal } from '../../core/models/models';
import { GoalDialogComponent } from '../../shared/components/goal-dialog/goal-dialog.component';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, DecimalPipe, MatButtonModule, MatIconModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss'
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];
  loading = false;
  Math = Math;

  constructor(private api: ApiService, private dialog: MatDialog, private snack: MatSnackBar) {}

  ngOnInit(): void { this.loadGoals(); }

  loadGoals(): void {
    this.loading = true;
    this.api.getGoals().subscribe({
      next: g => { this.goals = g; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openDialog(goal?: Goal): void {
    const ref = this.dialog.open(GoalDialogComponent, { data: { goal }, width: '480px' });
    ref.afterClosed().subscribe(result => {
      if (result) { this.loadGoals(); this.snack.open(goal ? 'Goal updated' : 'Goal created', 'Close', { duration: 2500 }); }
    });
  }

  openDeposit(goal: Goal): void {
    const ref = this.dialog.open(GoalDialogComponent, { data: { goal, depositMode: true }, width: '380px' });
    ref.afterClosed().subscribe(result => {
      if (result) { this.loadGoals(); this.snack.open('Funds added!', 'Close', { duration: 2500 }); }
    });
  }

  delete(goal: Goal): void {
    if (!confirm(`Delete goal "${goal.name}"?`)) return;
    this.api.deleteGoal(goal.id).subscribe({
      next: () => { this.goals = this.goals.filter(g => g.id !== goal.id); this.snack.open('Goal deleted', 'Close', { duration: 2500 }); }
    });
  }

  formatCurrency(v: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
  }

  daysLeft(deadline: string): number {
    const diff = new Date(deadline).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
