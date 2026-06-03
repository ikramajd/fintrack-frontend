import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Goal } from '../../core/models/models';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goals.component.html'
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];
  loading = false;

  showForm = false;
  editingId: number | null = null;
  form: FormGroup;

  Math = Math;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      targetAmount: [null, [Validators.required, Validators.min(1)]],
      currentAmount: [0],
      deadline: ['']
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getGoals().subscribe({
      next: (g) => { this.goals = g; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.form.reset({ name: '', description: '', targetAmount: null, currentAmount: 0, deadline: '' });
    this.showForm = true;
  }

  openEdit(g: Goal): void {
    this.editingId = g.id;
    this.form.reset({
      name: g.name, description: g.description, targetAmount: g.targetAmount,
      currentAmount: g.currentAmount, deadline: g.deadline
    });
    this.showForm = true;
  }

  cancel(): void { this.showForm = false; this.editingId = null; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.value;
    const request = this.editingId
      ? this.api.updateGoal(this.editingId, payload)
      : this.api.createGoal(payload);
    request.subscribe(() => { this.showForm = false; this.editingId = null; this.load(); });
  }

  deposit(g: Goal): void {
    const value = prompt(`Combien voulez-vous ajouter à "${g.name}" ? (€)`);
    if (!value) return;
    const amount = Number(value);
    if (isNaN(amount) || amount <= 0) return;
    this.api.depositGoal(g.id, amount).subscribe(() => this.load());
  }

  delete(g: Goal): void {
    if (!confirm(`Supprimer l'objectif "${g.name}" ?`)) return;
    this.api.deleteGoal(g.id).subscribe(() => this.load());
  }

  get name() { return this.form.controls['name']; }
  get targetAmount() { return this.form.controls['targetAmount']; }
}
