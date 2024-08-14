import State from '../../state/state';
import GarageView from '../../view/main/garage/garageView';
import CarManagement from './carManagement';
import GarageViewController from './garageViewController';

const MAX_CAR_COUNT_ON_PAGE = 10;

export default class GaragePageController {
  protected state: State;
  protected garageViewController: GarageViewController<GarageView>;
  protected garageView: GarageView;

  protected carManagement: CarManagement;
  constructor(
    state: State,
    garageView: GarageView,
    garageViewController: GarageViewController<GarageView>,
    carManagement: CarManagement
  ) {
    this.state = state;
    this.garageViewController = garageViewController;
    this.garageView = garageView;
    this.carManagement = carManagement;
    this.addListener();
    this.getNextPage = this.getNextPage.bind(this);
    this.getPrevPage = this.getPrevPage.bind(this);
  }
  addListener() {
    this.garageView.pageControlBlock.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('#prev')) {
        this.getPrevPage();
      } else if (target.closest('#next')) {
        this.getNextPage();
      }
    });
  }
  async getPrevPage() {
    this.garageViewController.disableButton(this.garageView.prevPageButton);
    await this.state.getCurrentPortionCars(this.state.currentPage - 1);
    this.updateGarageState();
  }
  async getNextPage() {
    this.garageViewController.disableButton(this.garageView.nextPageButton);
    await this.state.getCurrentPortionCars(this.state.currentPage + 1);
    this.updateGarageState();
  }
  updateGarageState() {
    this.garageViewController.controlPageButtonsEnabling(this.state);
    this.garageViewController.setPageCount(this.state.currentPage);
    this.carManagement.updateGarageState();
  }
}
