import { TrendingPage } from './trending.po';
import { notEqual } from 'assert';

describe('gitrepos trending view', () => {
  let page: TrendingPage;

  beforeEach(() => {
    page = new TrendingPage();
  });

  it('should display trending header', () => {
    page.navigateTo();
    expect(page.getPageHeaderText().getText()).toBe('Trending Repositories');
  });

  it('should show a list of trending repos', () => {
    page.navigateTo();
    expect(page.getRepoCardElements().count()).toBeGreaterThan(2);
  });

  it('should allow to switch between time periods', () => {
    page.navigateTo();
    expect(page.getDailyCardElements()).not.toEqual(page.getMonthlyRepoCardElements());
  });

  it('should show a repo name', () => {
    page.navigateTo();
    expect(page.getRepoName().getText()).toBeDefined();
  });

  it('should show a star count greater than zero', () => {
    page.navigateTo();
    expect(page.getStarCount().getText()).toBeGreaterThan(0);
  });


});
