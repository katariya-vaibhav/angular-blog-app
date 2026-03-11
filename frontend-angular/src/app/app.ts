import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend-angular');
  private router = inject(Router);

  constructor(private authService: AuthService) {}

  get isAdminPage(): boolean {
    return this.router.url.startsWith('/admin');
  }

  ngOnInit(): void {
    this.authService.loadCurrentUser().subscribe();
  }
}
