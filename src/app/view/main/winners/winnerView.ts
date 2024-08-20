import { carIcon } from '../../../../assets/carIcon';
import { WinnerObject } from '../../../types';
import { button, div } from '../../../utils/tags';
import WinnersView from './winnersView';

export default class WinnerView {
  constructor(
    winnersView: WinnersView,
    winnerObject: WinnerObject,
    index: number,
  ) {
    this.drawWinnerBlock(winnersView, winnerObject, index);
  }
  drawWinnerBlock(
    winnersView: WinnersView,
    carObject: WinnerObject,
    index: number,
  ) {
    const indexOfTable = index + 1;
    return div({
      classNames: ['table__row'],
      parentElement: winnersView.winnersList,
      childrenNodes: [
        div({
          text: `${indexOfTable}`,
          classNames: ['table__column', 'table__column-1'],
        }),
        div({
          innerHtml: carIcon(carObject.color),
          classNames: ['table__column', 'table__column-2'],
        }),
        div({
          text: carObject.name,
          classNames: ['table__column', 'table__column-3'],
        }),
        div({
          text: `${carObject.wins}`,
          classNames: ['table__column', 'table__column-4'],
        }),
        div({
          text: `${(carObject.time / 1000).toFixed(2)}s`,
          classNames: ['table__column', 'table__column-5'],
        }),
      ],
    });
  }
}
