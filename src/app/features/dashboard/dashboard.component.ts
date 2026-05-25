import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Dashboard, Transaction } from '../../core/models/models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  data: Dashboard | null = null;
  loading = true;
  private lineChart: Chart | null = null;
  private doughnutChart: Chart | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getDashboard().subscribe({
      next: (d) => {
        this.data = d;
        this.loading = false;
        setTimeout(() => this.renderCharts(), 100);
      },
      error: () => { this.loading = false; }
    });
  }

  private renderCharts(): void {
    if (!this.data) return;
    this.renderLineChart();
    this.renderDoughnutChart();
  }

  private renderLineChart(): void {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (!ctx || !this.data) return;
    if (this.lineChart) this.lineChart.destroy();

    const labels = this.data.monthlyData.map(m => {
      const [year, month] = m.month.split('-');
      return new Date(+year, +month - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
    });

    this.lineChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: this.data.monthlyData.map(m => m.income),
            backgroundColor: 'rgba(34,197,94,0.8)',
            borderRadius: 6,
          },
          {
            label: 'Expenses',
            data: this.data.monthlyData.map(m => m.expense),
            backgroundColor: 'rgba(239,68,68,0.8)',
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: (v) => '$' + v }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  private renderDoughnutChart(): void {
    const ctx = document.getElementById('doughnutChart') as HTMLCanvasElement;
    if (!ctx || !this.data || this.data.categorySpends.length === 0) return;
    if (this.doughnutChart) this.doughnutChart.destroy();

    const colors = ['#6366f1','#f97316','#22c55e','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#06b6d4','#84cc16'];

    this.doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.data.categorySpends.map(c => c.category),
        datasets: [{
          data: this.data.categorySpends.map(c => c.amount),
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' },
          tooltip: {
            callbacks: {
              label: (ctx) => ` $${Number(ctx.parsed).toFixed(2)} (${this.data!.categorySpends[ctx.dataIndex].percentage.toFixed(1)}%)`
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  }
}
