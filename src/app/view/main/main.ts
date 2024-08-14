import { div, img, main, p, span } from '../../utils/tags';
import mainBg from '../../../assets/bg.png';
import './main.scss';
import GarageView from './garage/garageView';
import WinnersView from './winners/winnersView';
import NotFoundView from './not-found/not-found-view';
import State from '../../state/state';
import Garage from '../../components/garage/garageViewController';
import GarageActions from '../../components/garage/garageActions';
import WinnersActions from '../../components/winners/winnersActions';

export default class MainView {
  public main: HTMLElement;
  public winnerWindow: HTMLElement;
  constructor() {
    this.drawBg();
    this.main = this.drawMain();
    this.winnerWindow = this.drawWinnerWindow();
  }
  drawBg() {
    return div({
      classNames: ['main-bg', 'bg'],
      parentElement: document.body,
      childrenNodes: [
        img({
          attr: { src: mainBg }
        })
      ]
    });
  }
  drawMain() {
    return main({
      classNames: ['main'],
      parentElement: document.body
    });
  }
  drawWinnerWindow() {
    return div({
      classNames: ['winner-window', 'hidden'],
      parentElement: document.body,
      childrenNodes: [span({})]
    });
  }
  setContent(
    element: typeof NotFoundView | typeof GarageView | typeof WinnersView,
    state: State,
    pageName: string
  ) {
    const htmlElement = this.main;
    while (htmlElement.firstElementChild) {
      htmlElement.firstElementChild.remove();
    }
    const view = new element(this.main);
    switch (pageName) {
      case 'garage':
        if (view instanceof GarageView) {
          new GarageActions(view, state, this.winnerWindow);
        }
        break;
      case 'winners':
        if (view instanceof WinnersView) {
          new WinnersActions(view, state);
        }
      default:
        break;
    }
  }
}
