import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, of } from 'rxjs';
import { Repository, TrendingResponse, Language } from '../model/repository';

export type Period = 'daily' | 'weekly' | 'monthly';

@Injectable({ providedIn: 'root' })
export class TrendingService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    'https://cdn.jsdelivr.net/gh/Hyraze/trending-collection@main/api';

  private readonly languagesUrl =
    'https://cdn.jsdelivr.net/gh/Hyraze/trending-collection@main/languages.json';

  readonly languages$: Observable<Language[]> = this.http
    .get<Language[]>(this.languagesUrl)
    .pipe(shareReplay(1));

  getTrending(
    slug: string | null = null,
    period: Period = 'daily'
  ): Observable<Repository[]> {
    const safeSlug = slug || 'all';
    const url = `${this.baseUrl}/${period}/${safeSlug}.json`;

    return this.http.get<TrendingResponse>(url).pipe(map((res) => res.items));
  }

  getReadme(repoUrl: string): Observable<string> {
    const parts = repoUrl.replace('https://github.com/', '').split('/');
    if (parts.length < 2) return of('Invalid repository URL.');
    
    const owner = parts[0];
    const repo = parts[1];
    
    // Fetch via GitHub API with custom accept header to get raw markdown
    const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
    return this.http.get(url, { 
      headers: { 'Accept': 'application/vnd.github.v3.raw' },
      responseType: 'text'
    });
  }
}
