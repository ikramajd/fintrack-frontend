import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Dashboard, SubScore } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  data: Dashboard | null = null;
  loading = true;

  // Jauge SVG (arc de 270°, rayon 80) — calcul fait main, pas de librairie
  readonly ARC = 377;       // 2π × 80 × (270/360)
  readonly CIRC = 503;      // 2π × 80
  displayScore = 0;
  arcOffset = 377;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getDashboard().subscribe({
      next: (d) => {
        this.data = d;
        this.loading = false;
        if (!this.isEmpty) setTimeout(() => this.animate(), 150);
      },
      error: () => { this.loading = false; }
    });
  }

  // Compte vide : aucune transaction (revenus et dépenses à 0)
  get isEmpty(): boolean {
    return !!this.data && this.data.totalIncome === 0 && this.data.totalExpense === 0
        && this.data.recentTransactions.length === 0;
  }

  private animate(): void {
    if (!this.data) return;
    const target = this.data.healthScore.score;
    this.arcOffset = this.ARC * (1 - target / 100);
    // Compteur animé
    const steps = 40;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      this.displayScore = Math.round(target * (i / steps));
      if (i >= steps) { this.displayScore = target; clearInterval(timer); }
    }, 25);
  }

  // ---- Graphique en barres mensuel (CSS) ----
  get maxMonthly(): number {
    if (!this.data) return 1;
    let max = 1;
    for (const m of this.data.monthlyData) max = Math.max(max, m.income, m.expense);
    return max;
  }
  barHeight(value: number): number { return Math.round((value / this.maxMonthly) * 100); }

  monthLabel(month: string): string {
    const [, m] = month.split('-');
    const noms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    return noms[Number(m) - 1] ?? month;
  }

  // ---- Donut CSS (conic-gradient) ----
  get donutGradient(): string {
    if (!this.data || this.data.categorySpends.length === 0) return '#e9ecef';
    let acc = 0;
    const parts: string[] = [];
    for (const c of this.data.categorySpends) {
      const start = acc;
      acc += c.percentage;
      parts.push(`${c.color} ${start}% ${acc}%`);
    }
    return `conic-gradient(${parts.join(', ')})`;
  }

  // Couleur d'une sous-métrique selon son ratio
  metricColor(s: SubScore): string {
    const p = s.score / s.maxScore;
    if (p >= 0.8) return '#22c55e';
    if (p >= 0.5) return '#eab308';
    if (p >= 0.25) return '#f97316';
    return '#ef4444';
  }
  metricPct(s: SubScore): number { return Math.round((s.score / s.maxScore) * 100); }

  get savingsRate(): number {
    if (!this.data || this.data.totalIncome <= 0) return 0;
    return Math.round((this.data.totalIncome - this.data.totalExpense) / this.data.totalIncome * 100);
  }
}
