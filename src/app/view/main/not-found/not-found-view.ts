import { section } from '../../../utils/tags';
import './not-found.scss';

export default class NotFoundView {
  protected section: HTMLElement;
  constructor(main: HTMLElement) {
    this.section = this.drawSection(main);
  }
  drawSection(main: HTMLElement) {
    return section({
      text: 'Page not found',
      classNames: ['not-found'],
      parentElement: main
    });
  }
}
