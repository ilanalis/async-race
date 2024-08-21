import './header.scss';
import { button, div, header, nav, span } from '../../utils/tags';
import Router from '../../router/router';

export default class HeaderView {
  protected header: HTMLElement;
  protected headerContainer: HTMLElement;
  protected logo: HTMLElement;
  protected nav: HTMLElement;
  protected pages: string[] = ['garage', 'winners'];
  private headerLinkElements = new Map<string, HTMLElement>();
  private eventHandlers = new Map<string, () => void>();

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
      parentElement: document.body,
    });
  }
  drawHeaderContainer() {
    return div({
      classNames: ['header__container', 'container'],
      parentElement: this.header,
    });
  }
  drawLogo() {
    return span({
      text: 'Race',
      classNames: ['header__logo'],
      parentElement: this.headerContainer,
    });
  }
  drawNav(router: Router) {
    const newPages = this.pages.map((page: string) => {
      const pageParam = {
        name: page,
        callback: () => router.navigate(page),
      };

      const link = button({
        classNames: ['header__link'],
        text: page,
      });

      const handler = () => pageParam.callback();

      this.eventHandlers.set(page, handler);

      link.addEventListener('click', handler);
      this.headerLinkElements.set(page, link);

      return link;
    });
    return nav({
      classNames: ['header__nav'],
      parentElement: this.headerContainer,
      childrenNodes: [...newPages],
    });
  }

  removeListeners() {
    this.headerLinkElements.forEach((link, page) => {
      const handler = this.eventHandlers.get(page);
      if (handler) {
        link.removeEventListener('click', handler);
      }
    });

    this.eventHandlers.clear();
    this.headerLinkElements.clear();
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
