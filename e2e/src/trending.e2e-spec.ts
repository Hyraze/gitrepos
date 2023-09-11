import { TrendingPage } from './trending.po';
describe('gitrepos trending view', () => {
  let page: TrendingPage;

  beforeEach(() => {
    page = new TrendingPage();
  });

  it('should show a repo name', () => {
    page.navigateTo();
    expect(page.getRepoName().getText()).toBeDefined();
  });
});
