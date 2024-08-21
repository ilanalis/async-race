import State from '../../state/state';
import WinnersView from '../../view/main/winners/winnersView';
import WinnersViewController from './winnersViewController';

const MAX_CAR_COUNT_ON_PAGE = 10;

export default class WinnersPageController {
  protected state: State;
  protected winnersViewController: WinnersViewController;
  protected winnersView: WinnersView;
  protected updateWinnersTableState: Function;

  constructor(
    state: State,
    winnersView: WinnersView,
    winnersViewController: WinnersViewController,
    updateWinnersTableState: Function,
  ) {
    this.state = state;
    this.winnersViewController = winnersViewController;
    this.winnersView = winnersView;
    this.addListener();
    this.getNextPage = this.getNextPage.bind(this);
    this.getPrevPage = this.getPrevPage.bind(this);
    this.updateWinnersTableState = updateWinnersTableState;
  }

  addListener() {
    this.winnersView.pageControlBlock.addEventListener(
      'click',
      this.eventHandler.bind(this),
    );
  }

  removeListener() {
    this.winnersView.pageControlBlock.removeEventListener(
      'click',
      this.eventHandler.bind(this),
    );
  }

  eventHandler(e: Event) {
    const target = e.target as HTMLElement;
    if (target.closest('#prev')) {
      this.getPrevPage();
    } else if (target.closest('#next')) {
      this.getNextPage();
    }
  }

  async getPrevPage() {
    this.winnersViewController.disableButton(this.winnersView.prevPageButton);
    await this.state.getCurrentPortionWinners(
      this.state.currentWinnersPage - 1,
    );
    this.updateWinnersState();
  }

  async getNextPage() {
    this.winnersViewController.disableButton(this.winnersView.nextPageButton);
    await this.state.getCurrentPortionWinners(
      this.state.currentWinnersPage + 1,
    );
    this.updateWinnersState();
  }

  updateWinnersState() {
    this.winnersViewController.controlPageButtonsEnabling(this.state);
    this.winnersViewController.setPageCount(this.state.currentWinnersPage);
    this.updateWinnersTableState();
  }
}
