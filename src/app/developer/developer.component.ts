import { Component, OnInit } from '@angular/core';
import { TrendingService } from '../service/trending.service';
import { Developer } from '../model/developer';
import { Language } from '../model/language';
import { FormControl } from '@angular/forms';
import { faCodeBranch,faFileCode,faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.scss']
})
export class DeveloperComponent implements OnInit {
  fork = faCodeBranch;
  language=faFileCode;
  star=faStar;
  developers: Developer;
  languages: Language;
  selectedSince = 'daily';
  selectedLanguage = 'all';
  loading = true;

  constructor(private trendingService: TrendingService) { }

  ngOnInit() {
    this.loadLanguages();
    this.loadDevs();
  }

  onLanuguageSelected(event) {
    this.loadDevs(event, this.selectedSince);
  }

  onSinceSelected(event) {
    this.loadDevs(this.selectedLanguage, event);
  }

  loadDevs(language: string = '', since: string = '') {
    language = (language !== 'all' ? language : '');
    this.trendingService.getTrendingDevs(language, since).subscribe({
      next: (data: Developer) => this.developers = data,
      complete: () => this.loading === false
    });
  }

  loadLanguages() {
    this.trendingService.getLanguages().subscribe({
      next: (data: Language) => this.languages = data
    });
  }
}

