import './header.scss';
import { button, div, header, nav, span } from '../../utils/tags';
import Router from '../../router/router';

export default class HeaderView {
  protected header: HTMLElement;
  protected headerContainer: HTMLElement;
  protected logo: HTMLElement;
  protected nav: HTMLElement;
  protected headerLinkElements: Map<string, HTMLElement>;

  constructor(router: Router) {
    this.headerLinkElements = new Map();
    this.header = this.drawHeader();
    this.headerContainer = this.drawHeaderContainer();
    this.logo = this.drawLogo();
    this.nav = this.drawNav(router);
  }
  drawHeader() {
    return header({
      classNames: ['header'],
      parentElement: document.body
    });
  }
  drawHeaderContainer() {
    return div({
      classNames: ['header__container', 'container'],
      parentElement: this.header
    });
  }
  drawLogo() {
    return span({
      text: 'Race',
      classNames: ['header__logo'],
      parentElement: this.headerContainer
    });
  }
  drawNav(router: Router) {
    let pages: HTMLElement[] | string[] = ['garage', 'winners'];

    const newPages = pages.map((page: string, index: number) => {
      const pageParam = {
        name: page,
        callback: () => router.navigate(page)
      };
      const link = button({
        classNames: ['header__link'],
        text: page
      });
      link.addEventListener('click', () => pageParam.callback());
      this.headerLinkElements.set(page, link);
      return link;
    });

    return nav({
      classNames: ['header__nav'],
      parentElement: this.headerContainer,
      childrenNodes: [...newPages]
    });
  }
  setSelectedItem(namePage: string) {
    const linkItem = this.headerLinkElements.get(namePage);
    this.nav.childNodes.forEach((linkElement) => {
      if (linkElement instanceof HTMLElement) {
        linkElement.classList.remove('header__link--active');
      }
    });
    linkItem?.classList.add('header__link--active');
  }
}
