import { browser, by, element } from 'protractor';

export class TrendingPage {
  navigateTo() {
    return browser.get('/');
  }

  getPageHeaderText() {
    return element(by.tagName('h1'));
  }

  getSinceSelector() {
    return element(by.css('.since'));
  }

  getDaily() {
    const since = this.getSinceSelector();
    since.click();
    return element(by.css('.daily'));
  }

  getMonthly() {
    const since = this.getSinceSelector();
    since.click();
    return element(by.css('.monthly'));
  }

  getRepoName() {
    return element(by.css('.repoName'));
  }

  getStarCount() {
    return element(by.css('.starCount'));
  }

  getRepoCardElements() {
    return element.all(by.css('.repoCards'));
  }

  getDailyCardElements() {
    const daily = this.getDaily();
    daily.click();
    return this.getRepoCardElements();
  }

  getMonthlyRepoCardElements() {
    const monthly = this.getMonthly();
    monthly.click();
    return this.getRepoCardElements();
  }
}
