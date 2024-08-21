import State from '../../state/state';
import WinnerView from '../../view/main/winners/winnerView';
import WinnersView from '../../view/main/winners/winnersView';
import GarageViewController from '../garage/garageViewController';
import WinnersPageController from './winnersPageController';
import WinnersViewController from './winnersViewController';

export default class WinnersActions<T extends WinnersView> {
  protected view: T;
  protected winnersViewController: WinnersViewController;
  protected winnersPageController: WinnersPageController | null = null;
  protected state: State;
  constructor(view: T, state: State) {
    this.state = state;
    this.view = view;
    this.winnersViewController = new WinnersViewController(view, state);

    if (this.winnersPageController) {
      this.winnersPageController.removeListener();
    }

    this.winnersPageController = new WinnersPageController(
      state,
      view,
      this.winnersViewController,
      this.updateWinnersTableState.bind(this),
    );
  }
  updateWinnersTableState() {
    this.winnersViewController.setWinnersCount(this.state.winnersCount);
    this.winnersViewController.setWinnersList(this.state.winners);
  }
}
