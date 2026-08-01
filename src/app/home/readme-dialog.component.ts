import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TrendingService } from '../service/trending.service';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-readme-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="book-icon">menu_book</mat-icon>
        {{ repoTitle }}
      </h2>
      <button mat-icon-button mat-dialog-close class="close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="dialog-content markdown-body">
      @if (loading()) {
        <div class="loading-state">
          <mat-spinner diameter="48"></mat-spinner>
          <p>Fetching README from GitHub...</p>
        </div>
      } @else if (error()) {
        <div class="error-state">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <p>{{ error() }}</p>
        </div>
      } @else {
        <div [innerHTML]="htmlContent()"></div>
      }
    </mat-dialog-content>
    
    <mat-dialog-actions align="end" class="dialog-actions">
      <a mat-button [href]="data.url" target="_blank" rel="noopener" class="github-btn">
        View on GitHub <mat-icon class="sm-icon">open_in_new</mat-icon>
      </a>
      <button mat-button mat-dialog-close class="close-text-btn">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: #111116;
    }
    .dialog-title {
      margin: 0 !important;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.4rem;
      font-weight: 700;
      color: #f9fafb;
    }
    .book-icon {
      color: #a855f7;
    }
    .close-btn {
      color: #9ca3af;
    }
    .dialog-content {
      padding: 24px;
      background: #09090e;
      color: #e5e7eb;
      min-height: 300px;
    }
    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      color: #9ca3af;
      gap: 16px;
    }
    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ef4444;
    }
    .dialog-actions {
      padding: 16px 24px;
      background: #111116;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin: 0 !important;
    }
    .github-btn {
      color: #a855f7;
    }
    .sm-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      vertical-align: middle;
      margin-left: 4px;
    }
    .close-text-btn {
      color: #e5e7eb;
    }
    
    /* Basic Markdown Styles injected by Marked */
    ::ng-deep .markdown-body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      word-wrap: break-word;
    }
    ::ng-deep .markdown-body h1, 
    ::ng-deep .markdown-body h2, 
    ::ng-deep .markdown-body h3 {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 0.3em;
      margin-top: 24px;
      margin-bottom: 16px;
    }
    ::ng-deep .markdown-body pre {
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      padding: 16px;
      overflow: auto;
    }
    ::ng-deep .markdown-body code {
      background-color: rgba(255, 255, 255, 0.1);
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }
    ::ng-deep .markdown-body pre code {
      background-color: transparent;
      padding: 0;
    }
    ::ng-deep .markdown-body a {
      color: #a855f7;
      text-decoration: none;
    }
    ::ng-deep .markdown-body img {
      max-width: 100%;
      box-sizing: content-box;
    }
    ::ng-deep .markdown-body blockquote {
      padding: 0 1em;
      color: #9ca3af;
      border-left: 0.25em solid rgba(255,255,255,0.2);
    }
  `]
})
export class ReadmeDialogComponent implements OnInit {
  private trendingService = inject(TrendingService);
  
  loading = signal(true);
  error = signal<string | null>(null);
  htmlContent = signal('');
  
  repoTitle: string;

  constructor(
    public dialogRef: MatDialogRef<ReadmeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string, title: string }
  ) {
    this.repoTitle = data.title;
  }

  ngOnInit(): void {
    this.trendingService.getReadme(this.data.url).subscribe({
      next: async (markdown) => {
        try {
          // Parse markdown to HTML
          const html = await marked.parse(markdown);
          // Sanitize to prevent XSS
          const safeHtml = DOMPurify.sanitize(html);
          this.htmlContent.set(safeHtml);
        } catch (e) {
          this.error.set('Failed to parse README markdown.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 404) {
          this.error.set('No README file found for this repository.');
        } else if (err.status === 403) {
          this.error.set('GitHub API rate limit exceeded. Please try again later.');
        } else {
          this.error.set('Failed to load README from GitHub.');
        }
        this.loading.set(false);
      }
    });
  }
}
