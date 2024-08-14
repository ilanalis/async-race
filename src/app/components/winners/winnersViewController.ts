import State from '../../state/state';
import { WinnerObject } from '../../types';
import WinnerView from '../../view/main/winners/winnerView';
import WinnersView from '../../view/main/winners/winnersView';

export default class WinnersViewController {
  protected winnersView: WinnersView;

  protected state: State;
  constructor(winnersView: WinnersView, state: State) {
    this.state = state;
    this.winnersView = winnersView;
    this.setWinnersList(state.winners);
    this.setWinnersCount(state.winnersCount);
    this.setPageCount(state.currentWinnersPage);
    this.controlPageButtonsEnabling(state);
  }
  enableButton(button: HTMLButtonElement | null) {
    button?.classList.remove('disabled');
  }
  disableButton(button: HTMLButtonElement | null) {
    button?.classList.add('disabled');
  }
  setWinnersCount(winnersCount: number) {
    this.winnersView.header.textContent = `Winners(${winnersCount})`;
  }
  setPageCount(pageNumber: number) {
    this.winnersView.pageNumber.textContent = `Page ${pageNumber}`;
  }
  setWinnersList(winners: WinnerObject[]) {
    while (this.winnersView.winnersList.firstChild) {
      this.winnersView.winnersList.firstChild.remove();
    }
    this.state.winners.forEach((winner, id) => {
      new WinnerView(this.winnersView, winner, id);
    });
  }
  controlPageButtonsEnabling(state: State) {
    const prevPageButton = this.winnersView.prevPageButton;
    const nextPageButton = this.winnersView.nextPageButton;
    const portionCount = Math.ceil(
      state.winnersCount / state.maxWinnersCountOnPage
    );
    console.log(state.winnersCount, state.maxWinnersCountOnPage);
    if (state.currentWinnersPage === 1) {
      if (!prevPageButton?.classList.contains('disabled')) {
        this.disableButton(prevPageButton);
      }
    }
    if (state.currentWinnersPage !== 1) {
      if (prevPageButton?.classList.contains('disabled')) {
        this.enableButton(prevPageButton);
      }
    }
    if (portionCount === state.currentWinnersPage) {
      if (!nextPageButton?.classList.contains('disabled')) {
        this.disableButton(nextPageButton);
      }
    }
    if (portionCount !== state.currentWinnersPage) {
      if (nextPageButton?.classList.contains('disabled')) {
        this.enableButton(nextPageButton);
      }
    }
  }
}
