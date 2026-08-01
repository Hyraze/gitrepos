import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { TrendingService, Period } from '../service/trending.service';
import { Language, Repository } from '../model/repository';
import { ReadmeDialogComponent } from './readme-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  template: `
    <div class="home-container">
      <div class="dashboard-header">
        <div class="title-area">
          <h2 class="section-title">
            @if (viewingBookmarks()) {
              <span class="fire-icon">⭐</span>
              My Bookmarks
            } @else {
              <span class="fire-icon">🔥</span>
              Trending
              <span class="highlight">
                {{ selectedLanguage()?.name ?? 'All Languages' }}
              </span>
            }
          </h2>
          @if (displayRepos().length) {
            <span class="repo-count">{{ displayRepos().length }}</span>
          }
        </div>

        <div class="controls-area">
          <mat-form-field appearance="outline" class="lang-search" subscriptSizing="dynamic" [class.hidden]="viewingBookmarks()">
            <mat-label>Language</mat-label>
            <mat-icon matPrefix>code</mat-icon>
            <input
              matInput
              [formControl]="langControl"
              [matAutocomplete]="auto"
              placeholder="All languages"
            />
            <mat-autocomplete
              #auto="matAutocomplete"
              [displayWith]="displayLang"
              (optionSelected)="onLangSelected($event.option.value)"
            >
              <mat-option [value]="null">🌐 All Languages</mat-option>
              @for (lang of filteredLanguages(); track lang.aliases[0]) {
                <mat-option [value]="lang">{{ lang.name }}</mat-option>
              }
            </mat-autocomplete>
          </mat-form-field>

          <mat-form-field appearance="outline" class="keyword-search" subscriptSizing="dynamic" [class.hidden]="viewingBookmarks()">
            <mat-icon matPrefix>search</mat-icon>
            <input
              matInput
              [formControl]="filterControl"
              placeholder="Filter by keyword..."
            />
            @if (filterControl.value) {
              <button matSuffix mat-icon-button aria-label="Clear" (click)="filterControl.setValue('')">
                <mat-icon>close</mat-icon>
              </button>
            }
          </mat-form-field>

          <div class="actions-right">
          @if (viewingBookmarks() && displayRepos().length > 0) {
            <button 
              class="bookmark-toggle-btn"
              (click)="exportBookmarks()"
              style="border-color: rgba(16, 185, 129, 0.4); color: #34d399;"
            >
              <mat-icon class="btn-icon">content_copy</mat-icon>
              <span>Copy Markdown</span>
            </button>
          }

          <button 
            class="bookmark-toggle-btn"
            [class.active]="viewingBookmarks()"
            (click)="toggleViewMode()"
          >
            <mat-icon class="btn-icon">{{ viewingBookmarks() ? 'arrow_back' : 'bookmarks' }}</mat-icon>
            <span>{{ viewingBookmarks() ? 'Back to Trending' : 'My Bookmarks' }}</span>
          </button>

            <mat-button-toggle-group
              *ngIf="!viewingBookmarks()"
              [value]="period()"
              class="period-toggle"
              aria-label="Time period"
              (change)="setPeriod($event.value)"
            >
              <mat-button-toggle value="daily">Daily</mat-button-toggle>
              <mat-button-toggle value="weekly">Weekly</mat-button-toggle>
              <mat-button-toggle value="monthly">Monthly</mat-button-toggle>
            </mat-button-toggle-group>
          </div>
        </div>
      </div>

      @if (loading() && !viewingBookmarks()) {
        <div class="loading-state">
          <mat-spinner diameter="48"></mat-spinner>
          <p>Loading trending repos…</p>
        </div>
      } @else if (error() && !viewingBookmarks()) {
        <div class="error-state">
          <mat-icon class="error-icon">cloud_off</mat-icon>
          <p>No trending data available for this language yet.</p>
          <button mat-stroked-button (click)="retry()">Try another</button>
        </div>
      } @else if (viewingBookmarks() && displayRepos().length === 0) {
        <div class="error-state">
          <mat-icon class="error-icon" style="color: #9ca3af;">bookmark_border</mat-icon>
          <p>You haven't bookmarked any repositories yet.</p>
          <button mat-stroked-button (click)="toggleViewMode()">Explore Trending</button>
        </div>
      } @else {
        <div class="repos-grid">
          @for (repo of displayRepos(); track repo.url) {
            <div class="repo-card">
              <div class="card-header">
                <mat-icon class="repo-icon">book</mat-icon>
                <span class="repo-title" [matTooltip]="repo.title">
                  {{ repo.title }}
                </span>
                
                @if (repo.isNew && !viewingBookmarks()) {
                  <span class="new-badge">✨ NEW</span>
                }
                
                <div class="actions-group">
                  <button 
                    class="action-btn"
                    (click)="viewReadme($event, repo)"
                    matTooltip="View README"
                  >
                    <mat-icon>menu_book</mat-icon>
                  </button>

                  <button 
                    class="action-btn" 
                    [class.is-bookmarked]="isBookmarked(repo.url)"
                    (click)="toggleBookmark($event, repo)"
                    [matTooltip]="isBookmarked(repo.url) ? 'Remove Bookmark' : 'Add Bookmark'"
                  >
                    <mat-icon>{{ isBookmarked(repo.url) ? 'bookmark' : 'bookmark_border' }}</mat-icon>
                  </button>
                </div>
              </div>

              <a [href]="repo.url" target="_blank" rel="noopener" class="card-link">
                <p class="repo-description">
                  {{ repo.description || 'No description provided.' }}
                </p>
              </a>

              <div class="card-footer">
                @if (repo.language) {
                  <span class="lang-chip">
                    <span
                      class="lang-dot"
                      [style.background]="repo.languageColor || '#8b949e'"
                    ></span>
                    {{ repo.language }}
                  </span>
                }

                <span class="stat" [matTooltip]="'Stars'">
                  <mat-icon class="stat-icon">star</mat-icon>
                  {{ repo.stars }}
                </span>

                <span class="stat" [matTooltip]="'Forks'">
                  <mat-icon class="stat-icon">fork_right</mat-icon>
                  {{ repo.forks }}
                </span>

                @if (repo.addStars && !viewingBookmarks()) {
                  <span class="stat trending-stat" [matTooltip]="'Stars gained'">
                    <mat-icon class="stat-icon">trending_up</mat-icon>
                    {{ repo.addStars }}
                  </span>
                }
              </div>

              @if (repo.contributors.length) {
                <div class="contributors">
                  @for (c of repo.contributors.slice(0, 5); track c.url) {
                    <img
                      [src]="c.avatar"
                      [alt]="c.name"
                      [matTooltip]="c.name"
                      class="avatar"
                      loading="lazy"
                    />
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .home-container {
      padding: 40px 48px;
      width: 100%;
      margin: 0;
      font-family: 'Inter', system-ui, sans-serif;
    }

    .card-link {
      text-decoration: none;
      color: inherit;
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 24px 20px;
      }
    }

    .dashboard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 24px;
      margin-bottom: 40px;
    }
    
    .title-area {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .controls-area {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .lang-search {
      min-width: 220px;
      max-width: 280px;
    }
    
    .keyword-search {
      min-width: 220px;
      max-width: 280px;
    }
    
    .lang-search.hidden {
      visibility: hidden;
    }

    .actions-right {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
      }
      .title-area {
        gap: 8px;
        width: 100%;
        flex-wrap: wrap;
      }
      .section-title {
        font-size: 1.4rem;
        line-height: 1.3;
      }
      .fire-icon {
        font-size: 1.5rem;
      }
      .repo-count {
        font-size: 0.75rem;
        padding: 4px 8px;
        white-space: nowrap;
      }
      .controls-area, .actions-right {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
      }
      .lang-search {
        min-width: 100%;
        max-width: 100%;
      }
      .period-toggle {
        display: flex;
        width: 100%;
      }
      ::ng-deep .period-toggle .mat-button-toggle {
        flex: 1;
      }
      ::ng-deep .period-toggle .mat-button-toggle-label-content {
        padding: 0 8px !important;
        font-size: 0.85rem !important;
      }
    }

    .bookmark-toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e5e7eb;
      padding: 0 20px;
      height: 40px;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    
    .bookmark-toggle-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .btn-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .bookmark-toggle-btn.active {
      background: rgba(168, 85, 247, 0.15);
      border-color: rgba(168, 85, 247, 0.4);
      color: #d8b4fe;
    }

    ::ng-deep .lang-search .mdc-text-field--outlined,
    ::ng-deep .keyword-search .mdc-text-field--outlined {
      --mdc-outlined-text-field-container-shape: 12px;
      --mdc-outlined-text-field-outline-color: rgba(255, 255, 255, 0.1);
      --mdc-outlined-text-field-focus-outline-color: #a855f7;
      --mdc-outlined-text-field-hover-outline-color: rgba(255, 255, 255, 0.25);
    }
    ::ng-deep .lang-search .mat-mdc-text-field-wrapper,
    ::ng-deep .keyword-search .mat-mdc-text-field-wrapper {
       background-color: rgba(0, 0, 0, 0.2);
    }

    .period-toggle {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    ::ng-deep .period-toggle .mat-button-toggle {
      font-size: 0.95rem;
      letter-spacing: 0.02em;
      font-weight: 600;
      color: #9ca3af;
      background: transparent;
      padding: 4px 16px;
      transition: all 0.2s ease;
    }
    
    ::ng-deep .period-toggle .mat-button-toggle-checked {
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      color: #ffffff;
    }
    ::ng-deep .period-toggle .mat-button-toggle-checked .mat-button-toggle-label-content {
      color: #ffffff !important;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .section-title {
      font-size: 2.2rem;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(135deg, #a855f7, #ec4899, #f43f5e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.03em;
      filter: drop-shadow(0 4px 12px rgba(236, 72, 153, 0.3));
    }

    .highlight {
      color: #ffffff;
      -webkit-text-fill-color: #ffffff;
    }

    .repo-count {
      font-size: 1rem;
      font-weight: 700;
      color: #f472b6;
      padding: 6px 16px;
      border-radius: 20px;
      background: rgba(244, 114, 182, 0.1);
      border: 1px solid rgba(244, 114, 182, 0.2);
      box-shadow: 0 4px 12px rgba(244, 114, 182, 0.1);
    }

    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      min-height: 400px;
      color: #9ca3af;
      border-radius: 24px;
      background: rgba(20, 20, 30, 0.4);
      border: 1px dashed rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .error-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ef4444;
      filter: drop-shadow(0 0 16px rgba(239, 68, 68, 0.4));
    }

    .repos-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 32px;
    }

    @media (max-width: 1100px) {
      .repos-grid {
        grid-template-columns: 1fr;
      }
    }

    .repo-card {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 32px;
      border-radius: 24px;
      background: rgba(25, 25, 35, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      position: relative;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .repo-card::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      border-radius: 24px;
      padding: 2px;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(236, 72, 153, 0.5));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .repo-card:hover {
      transform: translateY(-6px) scale(1.01);
      background: rgba(30, 30, 45, 0.9);
      box-shadow: 0 20px 40px rgba(168, 85, 247, 0.15), 0 10px 20px rgba(0, 0, 0, 0.4);
    }
    
    .repo-card:hover::after {
      opacity: 1;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .repo-icon {
      color: #a855f7;
      font-size: 28px;
      width: 28px;
      height: 28px;
      filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.5));
    }

    .repo-title {
      font-weight: 700;
      font-size: 1.4rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #f9fafb;
      letter-spacing: -0.01em;
      flex: 1;
    }
    
    .new-badge {
      background: linear-gradient(135deg, #f59e0b, #ef4444);
      color: white;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 12px;
      letter-spacing: 0.05em;
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
      animation: pulse-glow 2s infinite;
    }

    @keyframes pulse-glow {
      0% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
      50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.7); }
      100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
    }
    
    .actions-group {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .action-btn:hover {
      background: rgba(255,255,255,0.1);
      color: #e5e7eb;
    }
    
    .action-btn.is-bookmarked {
      color: #facc15;
      background: rgba(250, 204, 21, 0.1);
      border-color: rgba(250, 204, 21, 0.3);
      filter: drop-shadow(0 0 8px rgba(250, 204, 21, 0.4));
    }

    .repo-description {
      font-size: 1.05rem;
      color: #d1d5db;
      margin: 0;
      line-height: 1.7;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .lang-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #e5e7eb;
      background: rgba(255, 255, 255, 0.05);
      padding: 6px 12px;
      border-radius: 12px;
    }

    .lang-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      box-shadow: 0 0 10px currentColor;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      color: #9ca3af;
    }

    .stat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #6b7280;
    }

    .trending-stat {
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
      padding: 4px 10px;
      border-radius: 12px;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    
    .trending-stat .stat-icon {
      color: #10b981;
    }

    .contributors {
      display: flex;
      gap: -10px;
      margin-left: auto;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #1a1a24;
      object-fit: cover;
      margin-left: -10px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
    
    .avatar:first-child {
      margin-left: 0;
    }
    .repo-card:hover .avatar {
      border-color: #2a2a35;
    }
    .avatar:hover {
      transform: scale(1.2) translateY(-4px);
      z-index: 10;
      border-color: #a855f7;
    }
  `],
})
export class HomeComponent implements OnInit {
  private readonly service = inject(TrendingService);
  private readonly dialog = inject(MatDialog);

  readonly langControl = new FormControl<Language | null>(null);
  readonly filterControl = new FormControl<string>('');
  
  private readonly filterText = toSignal(this.filterControl.valueChanges, { initialValue: '' });

  period = signal<Period>('daily');
  viewingBookmarks = signal(false);

  private readonly allLanguages = toSignal(this.service.languages$, {
    initialValue: [] as Language[],
  });

  readonly filteredLanguages = toSignal(
    this.langControl.valueChanges.pipe(
      startWith(''),
      map((val) => {
        const query = typeof val === 'string' ? val : val?.name ?? '';
        return this.filterLangs(query);
      })
    ),
    { initialValue: [] as Language[] }
  );

  selectedLanguage = signal<Language | null>(null);

  private readonly loading_ = signal(false);
  private readonly error_ = signal(false);
  private readonly repos_ = signal<Repository[]>([]);
  
  private readonly savedBookmarks = signal<Record<string, Repository>>(this.loadBookmarks());
  private seenHistory: Record<string, string[]> = this.loadHistory();

  readonly loading = this.loading_.asReadonly();
  readonly error = this.error_.asReadonly();
  
  readonly displayRepos = computed(() => {
    let list = this.viewingBookmarks() 
      ? Object.values(this.savedBookmarks()) 
      : this.repos_();
      
    const keyword = (this.filterText() || '').toLowerCase().trim();
    if (keyword) {
      list = list.filter(repo => 
        (repo.title && repo.title.toLowerCase().includes(keyword)) || 
        (repo.description && repo.description.toLowerCase().includes(keyword))
      );
    }
    
    return list;
  });

  ngOnInit(): void {
    this.fetch();
  }
  
  private loadBookmarks(): Record<string, Repository> {
    try {
      const saved = localStorage.getItem('gitrepos_bookmarks');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  private loadHistory(): Record<string, string[]> {
    try {
      const saved = localStorage.getItem('gitrepos_seen_history');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  toggleBookmark(event: Event, repo: Repository): void {
    event.preventDefault();
    event.stopPropagation();
    
    const current = { ...this.savedBookmarks() };
    if (current[repo.url]) {
      delete current[repo.url];
    } else {
      current[repo.url] = repo;
    }
    
    this.savedBookmarks.set(current);
    localStorage.setItem('gitrepos_bookmarks', JSON.stringify(current));
  }
  
  viewReadme(event: Event, repo: Repository): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.dialog.open(ReadmeDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        url: repo.url,
        title: repo.title
      },
      panelClass: 'dark-dialog'
    });
  }
  
  isBookmarked(url: string): boolean {
    return !!this.savedBookmarks()[url];
  }
  
  toggleViewMode(): void {
    this.viewingBookmarks.set(!this.viewingBookmarks());
  }
  
  exportBookmarks(): void {
    const repos = Object.values(this.savedBookmarks());
    if (!repos.length) return;
    
    let markdown = '# 📌 My GitHub Trending Bookmarks\n\n';
    repos.forEach(repo => {
      markdown += `### [${repo.title}](${repo.url})\n`;
      if (repo.description) markdown += `> ${repo.description}\n\n`;
      markdown += `- **Language:** ${repo.language || 'Unknown'}\n`;
      markdown += `- **Stars:** ⭐ ${repo.stars} (Forks: 🍴 ${repo.forks})\n\n---\n\n`;
    });
    
    navigator.clipboard.writeText(markdown).then(() => {
      // Could add a snackbar here, but keeping it simple
      alert('Markdown copied to clipboard! Paste it anywhere.');
    });
  }

  onLangSelected(lang: Language | null): void {
    this.selectedLanguage.set(lang);
    this.langControl.setValue(lang, { emitEvent: false });
    this.fetch();
  }

  setPeriod(p: Period): void {
    this.period.set(p);
    this.fetch();
  }

  retry(): void {
    this.langControl.setValue(null);
    this.selectedLanguage.set(null);
    this.fetch();
  }

  displayLang(lang: Language | null): string {
    return lang?.name ?? '';
  }

  private filterLangs(query: string): Language[] {
    const q = query.toLowerCase();
    return this.allLanguages().filter((l) =>
      l.name.toLowerCase().includes(q) ||
      l.aliases.some((a) => a.toLowerCase().includes(q))
    );
  }

  private fetch(): void {
    const slug = this.selectedLanguage()?.aliases[0] ?? 'all';
    this.loading_.set(true);
    this.error_.set(false);

    this.service.getTrending(slug, this.period()).subscribe({
      next: (repos) => {
        const cacheKey = `${slug}_${this.period()}`;
        const prevSeen = new Set(this.seenHistory[cacheKey] || []);
        
        const annotatedRepos = repos.map(repo => ({
          ...repo,
          isNew: prevSeen.size > 0 && !prevSeen.has(repo.url)
        }));
        
        // Save current fetch to history
        this.seenHistory[cacheKey] = repos.map(r => r.url);
        localStorage.setItem('gitrepos_seen_history', JSON.stringify(this.seenHistory));

        this.repos_.set(annotatedRepos);
        this.loading_.set(false);
      },
      error: () => {
        this.error_.set(true);
        this.repos_.set([]);
        this.loading_.set(false);
      },
    });
  }
}
