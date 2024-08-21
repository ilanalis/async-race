import State from '../../state/state';
import GarageView from '../../view/main/garage/garageView';
import GarageController from './garageViewController';
import CarManagement from './carManagement';
import GaragePageController from './garagePageController';
import WinnersApi from '../../api/winners-api';
import CarsApi from '../../api/cars-api';

export default class GarageActions<T extends GarageView> {
  protected garageView: T;
  protected state: State;
  protected garageViewController: GarageController<GarageView>;
  protected garagePageController: GaragePageController | null = null;
  protected carsApi: CarsApi;
  protected winnersApi: WinnersApi;

  protected carManagement: CarManagement | null = null;

  constructor(view: T, state: State, winnerWindow: HTMLElement) {
    this.carsApi = new CarsApi();
    this.winnersApi = new WinnersApi(this.carsApi);
    this.garageView = view;
    this.state = state;
    this.garageViewController = new GarageController(
      this.garageView,
      state,
      winnerWindow,
    );

    if (this.carManagement) {
      this.carManagement.removeListeners(view);
    }

    this.carManagement = new CarManagement(
      this.garageViewController,
      this.garageView,
      this.state,
      this.startCar,
      this.stopCar.bind(this),
    );

    if (this.garagePageController) {
      this.garagePageController.removeListener();
    }

    this.garagePageController = new GaragePageController(
      this.state,
      this.garageView,
      this.garageViewController,
      this.carManagement,
    );
    this.addListener(view);
  }

  addListener(view: GarageView) {
    view.carsList.addEventListener('click', this.eventHandler.bind(this));
  }

  removeListener(view: GarageView) {
    view.carsList.removeEventListener('click', this.eventHandler.bind(this));
  }

  eventHandler(e: Event) {
    const target = e.target as HTMLElement;

    if (target.classList.contains('car__action-start')) {
      this.startCar(target);
    } else if (target.classList.contains('car__action-stop')) {
      this.stopCar(target);
    }

    if (target.id) {
      switch (target.id) {
        case 'remove':
          this.removeAuto(target);
          break;
        case 'select':
          this.selectCar(target);
          break;
        case 'start':
          break;
        default:
          break;
      }
    }
  }

  findId(target: HTMLElement) {
    return target.parentElement?.parentElement?.id;
  }

  findCarElement(carId: string) {
    const foundCarElement = Array.from(
      this.garageView.carsList.childNodes,
    ).find((car) => {
      const carElement = car as HTMLElement;
      return carElement.id === carId;
    }) as HTMLElement;
    return foundCarElement;
  }
  async removeAuto(target: HTMLElement) {
    const carId = this.findId(target);
    if (carId) {
      await this.state.removeCar(carId);
      this.garageViewController.setCarCount(this.state.carsCount);
      this.garageViewController.controlPageButtonsEnabling(this.state);
      this.carManagement?.updateGarageState();
    }
  }
  async selectCar(target: HTMLElement) {
    const carId = this.findId(target);
    this.garageViewController.enableButton(
      this.garageView.management.updateButton,
    );
    if (carId) {
      const car = await this.state.getCar(carId);
      if (!car) return;
      this.garageViewController.setUpdatingValue(car);
      this.state.updatingCarId = carId;
    }
  }
  async startCar(target: HTMLElement) {
    const raceButton = this.garageView.management.raceButton;
    if (!raceButton?.classList.contains('disabled')) {
      this.garageViewController.disableButton(raceButton);
    }
    const carId = this.findId(target);
    if (carId) {
      const foundCarElement = this.findCarElement(carId);
      const startButton = foundCarElement.querySelector('.car__action-start');
      const stopButton = foundCarElement.querySelector('.car__action-stop');
      this.garageViewController.disableButton(startButton as HTMLButtonElement);

      const carIcon = foundCarElement.querySelector(
        '.car__icon',
      ) as HTMLElement;
      const carData = await this.carsApi.startCar(carId);
      this.garageViewController.moveCarIcon(carIcon, carData);
      this.garageViewController.enableButton(stopButton as HTMLButtonElement);

      const isNotEngineBroken = await this.carsApi.driveModeOn(carId);
      if (!isNotEngineBroken.success) {
        this.garageViewController.pauseCarIcon(carIcon);
      }
    }
  }
  async stopCar(target: HTMLElement) {
    const carId = this.findId(target);
    if (carId) {
      const foundCarElement = this.findCarElement(carId);
      const startButton = foundCarElement.querySelector('.car__action-start');
      const stopButton = foundCarElement.querySelector('.car__action-stop');
      this.garageViewController.disableButton(stopButton as HTMLButtonElement);
      await this.carsApi.stopCar(carId);

      const carIcon = foundCarElement.querySelector(
        '.car__icon',
      ) as HTMLElement;
      this.garageViewController.moveCarIconToInitialState(carIcon);
      this.garageViewController.enableButton(startButton as HTMLButtonElement);
      const startButtons = Array.from(
        this.garageView.carsList.querySelectorAll('.car__action-start'),
      ) as HTMLElement[];
      const foundStartButton = startButtons.some((button) =>
        button.classList.contains('disabled'),
      );
      if (!foundStartButton) {
        this.garageViewController.enableButton(
          this.garageView.management.raceButton,
        );
      }
    }
  }
}
