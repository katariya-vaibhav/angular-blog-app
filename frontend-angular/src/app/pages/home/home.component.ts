import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { BlogCardComponent } from '../../components/blog-card/blog-card.component';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, BlogCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  search = '';
  data: any[] = [];
  
  constructor(public blogService: BlogService, private http: HttpClient) {
    effect(() => {
      if (this.blogService.refresh()) {
        this.fetchBlogs();
      }
    });
  }

  ngOnInit() {
    this.fetchBlogs();
  }

  fetchBlogs() {
    this.blogService.getAllBlogs().subscribe({
      error: (err) => console.log('Error fetching blogs:', err)
    });
  }

  ownerBlogSearchHandler() {
    if (!this.search.trim()) {
      this.data = [];
      return;
    }
    
    this.http.get<any>(`/api/v2/Blog/owner/${this.search}`).subscribe({
      next: (res) => {
        this.data = res;
        this.search = '';
      },
      error: (err) => {
        console.log('Error searching owner blog:', err);
      }
    });
  }

  get displayProduct() {
    return this.data.length > 0 ? this.data : this.blogService.blogs();
  }
}
