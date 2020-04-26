import { TestBed } from '@angular/core/testing';

import { TrendingService } from './trending.service';

describe('TrendingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrendingService = TestBed.get(TrendingService);
    expect(service).toBeTruthy();
  });
});
