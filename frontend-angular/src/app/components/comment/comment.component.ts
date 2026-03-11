import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { Comment } from '../../models/models';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit, OnChanges {
  @Input() blogId!: string;
  comments: Comment[] = [];
  commentValue = '';
  editingCommentId: string | null = null;
  editValue = '';

  constructor(
    public authService: AuthService,
    private blogService: BlogService
  ) {}

  ngOnInit() {
    if (this.blogId) {
      this.fetchComments();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['blogId'] && !changes['blogId'].firstChange) {
      this.fetchComments();
    }
  }

  fetchComments() {
    this.blogService.getComments(this.blogId).subscribe({
      next: (res) => {
        this.comments = res.comment || [];
      },
      error: (err) => console.error('Error fetching comments:', err)
    });
  }

  submitCommentHandler() {
    if (!this.commentValue.trim()) return;

    this.blogService.createComment(this.blogId, this.commentValue).subscribe({
      next: () => {
        this.commentValue = '';
        // backend returns unpopulated owner in newComment; refetch to keep UI consistent
        this.fetchComments();
      },
      error: (err) => console.error('Error submitting comment:', err)
    });
  }

  startEdit(comment: Comment) {
    this.editingCommentId = comment._id;
    this.editValue = comment.content;
  }

  cancelEdit() {
    this.editingCommentId = null;
    this.editValue = '';
  }

  saveEdit(commentId: string) {
    const value = this.editValue.trim();
    if (!value) return;

    this.blogService.updateComment(commentId, value).subscribe({
      next: () => {
        this.cancelEdit();
        // backend returns unpopulated owner in updatedComment; refetch
        this.fetchComments();
      },
      error: (err) => console.error('Error updating comment:', err)
    });
  }

  commentDeleteHandler(commentId: string) {
    this.blogService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c._id !== commentId);
      },
      error: (err) => console.error('Error deleting comment:', err)
    });
  }
}
