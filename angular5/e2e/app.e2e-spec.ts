import { Tassel.Angular4Page } from './app.po';

describe('tassel.angular4 App', () => {
  let page: Tassel.Angular4Page;

  beforeEach(() => {
    page = new Tassel.Angular4Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
