import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repository } from '../model/repository';
import { Developer } from '../model/developer';
import { Language } from '../model/language';

@Injectable({
  providedIn: 'root'
})
export class TrendingService {

  url = 'https://api.gitterapp.com';

  constructor(private http: HttpClient) {
  }

  getTrendingRepos(language: string, since: string): Observable<Repository> {
    return this.http.get<Repository>(`${this.url}/repositories?language=${language}&since=${since}`);
  }

  getTrendingDevs(language: string, since: string): Observable<Developer> {
    return this.http.get<Developer>(`${this.url}/developers?language=${language}&since=${since}`);
  }

  getLanguages(): Observable<Language> {
    return this.http.get<Language>(`${this.url}/languages`);
  }
}
