import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Category, Transaction } from '../../core/models/models';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-detail.component.html'
})
export class CategoryDetailComponent implements OnInit {
  categoryId!: number;
  category: Category | null = null;
  transactions: Transaction[] = [];
  total = 0;
  loading = true;

  // Injection du service ActivatedRoute (session 6)
  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    // Récupération du paramètre d'URL via paramMap (session 6)
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.loading = true;
    // Informations de la catégorie
    this.api.getCategories().subscribe(cats => {
      this.category = cats.find(c => c.id === this.categoryId) ?? null;
    });
    // Transactions filtrées par catégorie (endpoint de filtre existant)
    this.api.getTransactions({ categoryId: this.categoryId }).subscribe({
      next: (data) => {
        this.transactions = data;
        this.total = data.reduce((sum, t) => sum + t.amount, 0);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
