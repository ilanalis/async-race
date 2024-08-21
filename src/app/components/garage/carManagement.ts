import Api from '../../api/api';
import CarsApi from '../../api/cars-api';
import WinnersApi from '../../api/winners-api';
import State from '../../state/state';
import { CarObject } from '../../types';
import { carBrands, carsModels } from '../../utils/const';
import GarageView from '../../view/main/garage/garageView';
import GarageViewController from './garageViewController';

export default class CarManagement {
  protected state: State;
  protected garageView: GarageView;
  protected garageViewController: GarageViewController<GarageView>;
  protected carsApi: CarsApi;
  protected winnersApi: WinnersApi;
  protected startCar: Function;
  protected stopCar: Function;
  protected timeoutIndexArray: NodeJS.Timeout[];

  constructor(
    garageViewController: GarageViewController<GarageView>,
    garageView: GarageView,
    state: State,
    startCar: Function,
    stopCar: Function,
  ) {
    this.carsApi = new CarsApi();
    this.winnersApi = new WinnersApi(this.carsApi);
    this.garageView = garageView;
    this.garageViewController = garageViewController;
    this.state = state;
    this.startCar = startCar;
    this.stopCar = stopCar;
    this.timeoutIndexArray = [];

    this.submitCreatingCar = this.submitCreatingCar.bind(this);
    this.submitUpdatingCar = this.submitUpdatingCar.bind(this);
    this.generateCars = this.generateCars.bind(this);
    this.eventHandlers = this.eventHandlers.bind(this);
    this.removeListeners(garageView);
    this.addListeners(garageView);
  }

  addListeners(garageView: GarageView) {
    this.addListener(
      garageView.management.creatingCarForm,
      'submit',
      this.submitCreatingCar,
    );
    this.addListener(
      garageView.management.updatingCarFrom,
      'submit',
      this.submitUpdatingCar,
    );
    this.addListener(
      garageView.management.carsControlPanel,
      'click',
      this.eventHandlers,
    );
    this.addListener(
      garageView.management.carCreatingTextInput,
      'keyup',
      this.saveCreatingCarTextInput.bind(this),
    );
    this.addListener(
      garageView.management.carCreatingPickColorInput,
      'change',
      this.saveCreatingCarPickColorInput.bind(this),
    );
    this.addListener(
      garageView.management.carUpdatingTextInput,
      'keyup',
      this.saveUpdatingCarTextInput.bind(this),
    );
    this.addListener(
      garageView.management.carUpdatingPickColorInput,
      'change',
      this.saveUpdatingCarPickColorInput.bind(this),
    );
  }

  removeListeners(garageView: GarageView) {
    this.removeListener(
      garageView.management.creatingCarForm,
      'submit',
      this.submitCreatingCar,
    );
    this.removeListener(
      garageView.management.updatingCarFrom,
      'submit',
      this.submitUpdatingCar,
    );
    this.removeListener(
      garageView.management.carsControlPanel,
      'click',
      this.eventHandlers,
    );
    this.removeListener(
      garageView.management.carCreatingTextInput,
      'keyup',
      this.saveCreatingCarTextInput.bind(this),
    );
    this.removeListener(
      garageView.management.carCreatingPickColorInput,
      'change',
      this.saveCreatingCarPickColorInput.bind(this),
    );
    this.removeListener(
      garageView.management.carUpdatingTextInput,
      'keyup',
      this.saveUpdatingCarTextInput.bind(this),
    );
    this.removeListener(
      garageView.management.carUpdatingPickColorInput,
      'change',
      this.saveUpdatingCarPickColorInput.bind(this),
    );
  }

  addListener(
    element: HTMLElement | null,
    event: string,
    handler: EventListenerOrEventListenerObject,
  ) {
    if (!element) return;

    element.addEventListener(event, handler);
  }

  removeListener(
    element: HTMLElement | null,
    event: string,
    handler: EventListenerOrEventListenerObject,
  ) {
    if (!element) return;

    element.removeEventListener(event, handler);
  }

  saveCreatingCarTextInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.state.saveCreatingCarTextInput(target.value);
  }

  saveCreatingCarPickColorInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.state.saveCreatingCarPickColorInput(target.value);
  }

  saveUpdatingCarTextInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.state.saveUpdatingCarTextInput(target.value);
  }

  saveUpdatingCarPickColorInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.state.saveUpdatingCarPickColorInput(target.value);
  }

  eventHandlers(event: Event) {
    const target = event.target as HTMLElement;
    if (target.closest('#generate-cars')) {
      this.generateCars(target);
    } else if (target.closest('#race')) {
      this.startRace();
    } else if (target.closest('#reset')) {
      this.stopAllCars();
    }
  }

  async startRace() {
    const carElements = this.getCarElements();
    this.initRace(carElements);
    let isFirstCarFinished = false;
    let isRaceStarted = false;
    const carEngineDataArray = await this.carsApi.startAllCars(this.state.cars);
    this.enableButtons(carElements, 'stop');
    const promises = carElements.map(
      async (element: HTMLElement, index: number) => {
        if (!isRaceStarted) {
          isRaceStarted = true;
          this.garageViewController.enableButton(
            this.garageView.management.resetButton,
          );
        }
        const carIcon = element.querySelector('.car__icon') as HTMLElement;
        const currentEngineData = carEngineDataArray[index];
        this.garageViewController.moveCarIcon(carIcon, currentEngineData);
        if (!currentEngineData.distance || !currentEngineData.velocity) return;
        const carSpeed = Math.round(
          currentEngineData.distance / currentEngineData.velocity,
        );
        const currentTimeoutId: NodeJS.Timeout = setTimeout(async () => {
          if (!isFirstCarFinished) {
            const firstCarId = element.id;
            isFirstCarFinished = true;
            this.handleWinner(firstCarId, carSpeed);
          }
        }, carSpeed);
        this.timeoutIndexArray.push(currentTimeoutId);
        await this.handleEngine(element.id, currentTimeoutId, carIcon);
      },
    );
    await Promise.allSettled(promises);
  }

  initRace(carElements: HTMLElement[]) {
    this.state.isRaceActive = true;
    this.garageViewController.disableButton(
      this.garageView.management.raceButton as HTMLButtonElement,
    );
    this.garageViewController.disableButton(
      this.garageView.management.resetButton,
    );
    this.disableButtons(carElements, 'start');
  }

  getCarElements() {
    return Array.from(this.garageView.carsList.childNodes) as HTMLElement[];
  }

  async handleWinner(id: string, carSpeed: number) {
    const foundCar = await this.state.getCar(id);
    if (!foundCar) return;
    this.garageViewController.openWinnerWindow(foundCar.name, carSpeed);
    this.createWinner(id, carSpeed);
  }

  async handleEngine(
    carId: string,
    timeoutId: NodeJS.Timeout,
    carIcon: HTMLElement,
  ) {
    const isNotEngineBroken = await this.carsApi.driveModeOn(carId);
    if (!isNotEngineBroken.success) {
      clearTimeout(timeoutId);
      this.garageViewController.pauseCarIcon(carIcon);
    }
  }

  createWinner(id: string, currentTime: number) {
    const foundWinner = this.state.winners.find((winner) => {
      return String(winner.id) === id;
    });
    if (foundWinner) {
      const winnerObject = {
        wins: foundWinner.wins + 1,
        time: foundWinner.time > currentTime ? currentTime : foundWinner.time,
      };
      this.winnersApi.updateWinner(id, winnerObject);
    } else {
      const winnerObject = {
        id,
        wins: 1,
        time: currentTime,
      };
      this.winnersApi.createWinner(winnerObject);
    }
    this.state.getWinnersCount();
    this.state.getCurrentPortionWinners(this.state.currentWinnersPage);
  }

  disableButtons(carElements: HTMLElement[], button: 'start' | 'stop') {
    carElements.forEach((car: HTMLElement) => {
      const foundButton = car.querySelector(`.car__action-${button}`);
      this.garageViewController.disableButton(foundButton as HTMLButtonElement);
    });
  }

  enableButtons(carElements: HTMLElement[], button: 'start' | 'stop') {
    carElements.forEach((car: HTMLElement) => {
      const foundButton = car.querySelector(`.car__action-${button}`);
      this.garageViewController.enableButton(foundButton as HTMLButtonElement);
    });
  }

  async stopAllCars() {
    this.timeoutIndexArray.forEach((id) => {
      clearTimeout(id);
    });
    const carElements = this.getCarElements();
    this.disableButtons(carElements, 'stop');
    const stopPromises = carElements.map(async (element: HTMLElement) => {
      await this.carsApi.stopCar(element.id);
      const carIcon = element.querySelector('.car__icon') as HTMLElement;
      this.garageViewController.moveCarIconToInitialState(carIcon);
    });
    await Promise.all(stopPromises);
    this.enableButtons(carElements, 'start');
    this.garageViewController.enableButton(
      this.garageView.management.raceButton,
    );
  }

  async generateCars(target: HTMLElement) {
    this.garageViewController.disableButton(target as HTMLButtonElement);
    const cars: CarObject[] = [];
    for (let i = 1; i <= 100; i += 1) {
      const carBrand = carBrands[Math.floor(Math.random() * carBrands.length)];
      const carModel = carsModels[Math.floor(Math.random() * carBrands.length)];
      const color = this.getRandomHexValue();
      const newCar = {
        name: carBrand + ' ' + carModel,
        color,
        id: this.state.lastCarId + 1 + i,
      };
      cars.push(newCar);
    }
    await this.state.generateCars(cars);
    console.log(this.state.cars);
    this.garageViewController.enableButton(target as HTMLButtonElement);
    this.state.getCarsCount();
    await this.state.getCurrentPortionCars(this.state.currentPage);
    this.updateGarageState();
    this.garageViewController.controlPageButtonsEnabling(this.state);
  }

  async submitCreatingCar(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const values = this.getFormValues(form);
    const newCar = {
      name: values.textInputValue,
      color: values.colorInputValue,
      id: this.state.lastCarId + 1,
    };
    await this.state.createCar(newCar);
    form.reset();
    this.garageViewController.controlPageButtonsEnabling(this.state);
    this.updateGarageState();
  }

  async submitUpdatingCar(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const values = this.getFormValues(form);
    const updatingCar = {
      name: values.textInputValue,
      color: values.colorInputValue,
    };
    await this.state.updateCar(this.state.updatingCarId, updatingCar);
    form.reset();
    this.updateGarageState();
    this.garageViewController.disableButton(
      this.garageView.management.updateButton,
    );
  }

  getRandomHexValue() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const redHex = red.toString(16).padStart(2, '0');
    const greenHex = green.toString(16).padStart(2, '0');
    const blueHex = blue.toString(16).padStart(2, '0');
    const hexValue = `#${redHex}${greenHex}${blueHex}`;
    return hexValue;
  }
  getFormValues(form: HTMLFormElement) {
    const textInput = form.childNodes[0] as HTMLInputElement;
    const textInputValue = textInput.value;
    const colorInput = form.childNodes[1] as HTMLInputElement;
    const colorInputValue = colorInput.value;
    return { textInputValue, colorInputValue };
  }

  updateGarageState() {
    this.garageViewController.setCarCount(this.state.carsCount);
    this.garageViewController.setCarsList(this.state.cars);
  }
}
