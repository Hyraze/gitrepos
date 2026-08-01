export interface Contributor {
  avatar: string;
  name: string;
  url: string;
}

export interface Repository {
  title: string;
  url: string;
  description: string;
  language: string;
  languageColor: string;
  stars: string;
  forks: string;
  addStars: string;
  contributors: Contributor[];
  isNew?: boolean;
}

export interface TrendingResponse {
  title: string;
  description: string;
  items: Repository[];
}

export interface Language {
  name: string;
  aliases: string[];
}
