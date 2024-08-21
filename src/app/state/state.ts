import Api from '../api/api';
import Car from '../view/main/garage/carView';
import { CarObject, WinnerObject, updatingCarObject } from '../types';
import CarsApi from '../api/cars-api';
import WinnersApi from '../api/winners-api';

const KEY_FOR_SAVE_TO_LOCALSTORAGE =
  'usersState(fd59d21d-9e17-4c69-a0d6-09c0722c3ed4)';

interface UsersState {
  carCreatingTextInput?: string;
  carCreatingPickColorInput?: string;
  carUpdatingTextInput?: string;
  carUpdatingPickColorInput?: string;
  currentPage?: number;
}

export default class State {
  public currentPage: number = 1;
  public currentWinnersPage: number = 1;
  public updatingCarId: string = '';
  public lastCarId: number = 0;
  public usersState: UsersState = {};

  public cars: CarObject[] = [];
  public winners: WinnerObject[] = [];
  public carsCount: number = 0;
  public winnersCount: number = 0;
  public isRaceActive: Boolean = false;
  protected carsApi: CarsApi;
  protected winnersApi: WinnersApi;

  constructor() {
    this.carsApi = new CarsApi();
    this.winnersApi = new WinnersApi(this.carsApi);
    this.loadState();
    window.addEventListener('beforeunload', this.saveState.bind(this));
  }

  removeListener() {
    window.removeEventListener('beforeunload', this.saveState.bind(this));
  }

  loadState() {
    const storageItem = localStorage.getItem(KEY_FOR_SAVE_TO_LOCALSTORAGE);
    if (storageItem) {
      this.usersState = JSON.parse(storageItem);
    }
  }
  saveState() {
    localStorage.setItem(
      KEY_FOR_SAVE_TO_LOCALSTORAGE,
      JSON.stringify(this.usersState),
    );
  }
  async start() {
    await this.getCarsCount();
    await this.getCurrentPortionCars(this.currentPage);
    await this.getWinnersCount();
    await this.getCurrentPortionWinners(this.currentWinnersPage);
  }
  async getCarsCount() {
    try {
      const cars = await this.carsApi.getCars();
      this.carsCount = cars.length;
      this.lastCarId = cars[cars.length - 1].id;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async getCurrentPortionCars(page: number) {
    this.currentPage = page;
    try {
      this.cars = await this.carsApi.getCars(this.currentPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async getCurrentPortionWinners(page: number) {
    this.currentWinnersPage = page;
    try {
      this.winners = await this.winnersApi.getWinners(this.currentWinnersPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async getWinnersCount() {
    const winners = await this.winnersApi.getWinners();
    this.winnersCount = winners.length;
  }
  async removeCar(id: string) {
    try {
      await this.carsApi.removeCar(id);
      await this.getCarsCount();
      await this.getCurrentPortionCars(this.currentPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async createCar(carObject: CarObject) {
    try {
      await this.carsApi.createCar(carObject);
      await this.getCarsCount();
      await this.getCurrentPortionCars(this.currentPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async generateCars(cars: CarObject[]) {
    try {
      for (const car of cars) {
        await this.carsApi.createCar(car);
        this.lastCarId += 1;
      }
      await this.getCarsCount();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async getCar(id: string) {
    try {
      const car = await this.carsApi.getCar(id);
      return car;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async updateCar(id: string, updatingCarObject: updatingCarObject) {
    try {
      await this.carsApi.updateCar(id, updatingCarObject);
      await this.getCarsCount();
      await this.getCurrentPortionCars(this.currentPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  saveCreatingCarTextInput(value: string) {
    this.usersState.carCreatingTextInput = value;
  }
  saveCreatingCarPickColorInput(value: string) {
    this.usersState.carCreatingPickColorInput = value;
  }
  saveUpdatingCarTextInput(value: string) {
    this.usersState.carUpdatingTextInput = value;
  }
  saveUpdatingCarPickColorInput(value: string) {
    this.usersState.carUpdatingPickColorInput = value;
  }
}
