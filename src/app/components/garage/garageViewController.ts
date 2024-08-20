import State from '../../state/state';
import { CarObject } from '../../types';
import GarageView from '../../view/main/garage/garageView';
import CarView from '../../view/main/garage/carView';
import { maxCarCountOnPage } from '../../utils/const';

export default class GarageViewController<T extends GarageView> {
  protected garageView: GarageView;
  protected winnerWindow: HTMLElement;
  constructor(view: T, state: State, winnerWindow: HTMLElement) {
    this.garageView = view;
    this.winnerWindow = winnerWindow;
    this.setCarCount(state.carsCount);
    this.setPageCount(state.currentPage);
    this.setCarsList(state.cars);
    this.controlPageButtonsEnabling(state);
    this.setInputsValue(state);
    this.setRaceButtonState(state);
  }
  setCarCount(carsCount: number) {
    this.garageView.header.textContent = `Garage (${carsCount})`;
  }
  setPageCount(currentPage: number) {
    this.garageView.pageNumber.textContent = `Page ${currentPage}`;
  }
  setCarsList(cars: CarObject[]) {
    while (this.garageView.carsList.firstChild) {
      this.garageView.carsList.firstChild.remove();
    }
    cars.forEach((car) => {
      return new CarView(this.garageView, car);
    });
  }
  setUpdatingValue(car: CarObject) {
    const textInput = this.garageView.management.carUpdatingTextInput;
    const colorInput = this.garageView.management.carUpdatingPickColorInput;
    if (textInput && colorInput) {
      textInput.value = car.name;
      colorInput.value = car.color;
    }
  }
  enableButton(button: HTMLButtonElement | null) {
    button?.classList.remove('disabled');
  }
  disableButton(button: HTMLButtonElement | null) {
    button?.classList.add('disabled');
  }
  controlPageButtonsEnabling(state: State) {
    const prevPageButton = this.garageView.prevPageButton;
    const nextPageButton = this.garageView.nextPageButton;
    const portionCount = Math.ceil(state.carsCount / maxCarCountOnPage);

    if (state.currentPage === 1) {
      if (!prevPageButton?.classList.contains('disabled')) {
        this.disableButton(prevPageButton);
      }
    }
    if (state.currentPage !== 1) {
      if (prevPageButton?.classList.contains('disabled')) {
        this.enableButton(prevPageButton);
      }
    }
    if (portionCount === state.currentPage) {
      if (!nextPageButton?.classList.contains('disabled')) {
        this.disableButton(nextPageButton);
      }
    }
    if (portionCount !== state.currentPage) {
      if (nextPageButton?.classList.contains('disabled')) {
        this.enableButton(nextPageButton);
      }
    }
  }
  setInputsValue(state: State) {
    const carCreatingTextInput =
      this.garageView.management.carCreatingTextInput;
    const carCreatingPickColorInput =
      this.garageView.management.carCreatingPickColorInput;
    const carUpdatingTextInput =
      this.garageView.management.carUpdatingTextInput;
    const carUpdatingPickColorInput =
      this.garageView.management.carUpdatingPickColorInput;
    if (carCreatingTextInput) {
      carCreatingTextInput.value = state.usersState.carCreatingTextInput
        ? state.usersState.carCreatingTextInput
        : '';
    }
    if (carCreatingPickColorInput) {
      carCreatingPickColorInput.value = state.usersState
        .carCreatingPickColorInput
        ? state.usersState.carCreatingPickColorInput
        : '#000000';
    }
    if (carUpdatingTextInput) {
      carUpdatingTextInput.value = state.usersState.carUpdatingTextInput
        ? state.usersState.carUpdatingTextInput
        : '';
    }
    if (carUpdatingPickColorInput) {
      carUpdatingPickColorInput.value = state.usersState
        .carUpdatingPickColorInput
        ? state.usersState.carUpdatingPickColorInput
        : '#000000';
    }
  }
  moveCarIcon(carIcon: HTMLElement | null, carData: CarObject) {
    if (!carData.distance || !carData.velocity) return;
    const carSpeed = Math.round(carData.distance / carData.velocity);
    if (carIcon) {
      carIcon.style.animationDuration = `${carSpeed}ms`;
    }
    carIcon?.classList.add('car__icon--moving');
  }
  pauseCarIcon(carIcon: HTMLElement | null) {
    carIcon?.classList.add('car__icon--paused');
  }
  moveCarIconToInitialState(carIcon: HTMLElement | null) {
    carIcon?.classList.remove('car__icon--paused');
    carIcon?.classList.remove('car__icon--moving');
  }
  openWinnerWindow(name: string, time: number) {
    this.winnerWindow.classList.remove('hidden');
    this.winnerWindow.childNodes[0].textContent = `${name} finished first(${Number((time / 1000).toFixed(2))}s)`;
    setTimeout(() => this.closeWinnerWindow(), 3000);
  }
  closeWinnerWindow() {
    this.winnerWindow.classList.add('hidden');
  }
  setRaceButtonState(state: State) {
    if (state.isRaceActive)
      this.disableButton(this.garageView.management.raceButton);
  }
}
