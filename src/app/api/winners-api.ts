import { CarObject, WinnerObject } from '../types';
import { baseUrl, maxWinnersCountOnPage } from '../utils/const';
import Api from './api';
import CarsApi from './cars-api';

export default class WinnersApi extends Api {
  protected carsApi: CarsApi;

  constructor(carsApi: CarsApi) {
    super();
    this.carsApi = carsApi;
  }

  async getWinners(page?: number): Promise<WinnerObject[]> {
    let url = baseUrl + '/winners';

    if (page) {
      url = baseUrl + `/winners?_page=${page}&_limit=${maxWinnersCountOnPage}`;
    }

    const cars = await this.makeRequest<WinnerObject[]>(url);

    return this.getWinnersData(cars);
  }

  async getWinnersData(winners: WinnerObject[]): Promise<WinnerObject[]> {
    const winnersData = await winners.map(async (winner: WinnerObject) => {
      const carData = await this.carsApi.getCar(String(winner.id));
      const winnerData: WinnerObject = {
        name: carData.name,
        color: carData.color,
        wins: winner.wins,
        time: winner.time,
        id: carData.id,
      };

      return winnerData;
    });

    return await Promise.all(winnersData);
  }

  async createWinner(winnerObject: { id: string; wins: number; time: number }) {
    const url = baseUrl + '/winners';
    await this.makeRequest(
      url,
      'POST',
      {
        'Content-Type': 'application/json',
      },
      winnerObject,
    );
  }

  async updateWinner(
    id: string,
    winnerObject: { wins: number; time: number | undefined },
  ) {
    const url = baseUrl + `/winners/${id}`;
    await this.makeRequest(
      url,
      'PUT',
      {
        'Content-Type': 'application/json',
      },
      winnerObject,
    );
  }
}
