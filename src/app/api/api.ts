import { CarObject, WinnerObject, updatingCarObject } from '../types';

const baseUrl = 'http://127.0.0.1:3000';

export default class Api {
  protected signal: AbortSignal | null = null;
  protected controller: AbortController | null = null;
  constructor() {}
  async makeRequest(
    link: string,
    method: string = 'GET',
    headers?: HeadersInit,
    body?: object,
    signal?: AbortSignal
  ) {
    try {
      const response = await fetch(link, {
        method,
        headers,
        body: JSON.stringify(body),
        signal
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  async getCars(page?: number, limit?: number) {
    if (page && limit) {
      const url = baseUrl + `/garage?_page=${page}&_limit=${limit}`;
      const cars = await this.makeRequest(url);
      return cars;
    } else {
      const url = baseUrl + '/garage';
      const cars = await this.makeRequest(url);
      return cars;
    }
  }
  async removeCar(id: string) {
    const url = baseUrl + `/garage/${id}`;
    await this.makeRequest(url, 'DELETE');
  }
  async createCar(carData: CarObject) {
    const url = baseUrl + `/garage`;
    await this.makeRequest(
      url,
      'POST',
      {
        'Content-Type': 'application/json'
      },
      carData
    );
  }
  async getCar(id: string) {
    const url = baseUrl + `/garage/${id}`;
    const car = await this.makeRequest(url);
    return car;
  }
  async updateCar(id: string, updatingCarObject: updatingCarObject) {
    const url = baseUrl + `/garage/${id}`;
    await this.makeRequest(
      url,
      'PUT',
      {
        'Content-Type': 'application/json'
      },
      updatingCarObject
    );
  }
  async startCar(id: string) {
    const url = baseUrl + `/engine/?id=${id}&status=started`;
    const carData = await this.makeRequest(url, 'PATCH');
    return carData;
  }
  async stopCar(id: string) {
    const url = baseUrl + `/engine/?id=${id}&status=stopped`;
    await this.makeRequest(url, 'PATCH');
    if (this.controller) {
      await this.controller.abort();
    }
  }
  async driveModeOn(id: string) {
    this.controller = new AbortController();
    this.signal = this.controller.signal;
    const url = baseUrl + `/engine/?id=${id}&status=drive`;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        signal: this.signal
      });
      if (!response.ok) {
        if (response.status === 500) {
          return {
            success: false
          };
        }
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Request aborted by user');
        return {
          success: false
        };
      } else {
        console.error('Error fetching data:', error);
        throw error;
      }
    }
  }
  async startAllCars(cars: CarObject[]) {
    const promises = cars.map((car) => {
      return this.startCar(String(car.id));
    });
    const carDataArray = await Promise.all(promises);
    return carDataArray;
  }
  async resetAllCars(cars: CarObject[]) {
    const promises = cars.map((car) => {
      return this.stopCar(String(car.id));
    });
    return await Promise.all(promises);
  }
  async getWinners(page?: number, limit?: number) {
    if (page && limit) {
      const url = baseUrl + `/winners?_page=${page}&_limit=${limit}`;
      const cars = await this.makeRequest(url);
      return this.getWinnersData(cars);
    } else {
      const url = baseUrl + '/winners';
      const cars = await this.makeRequest(url);
      return this.getWinnersData(cars);
    }
  }

  async getWinnersData(winners: {id: number,time: number,wins: number}[]) {
    // const winners = await this.getWinners();

    const winnersData = await winners.map(
      async (winner: { id: number; time: number; wins: number }) => {
        const carData = await this.getCar(String(winner.id));
        const winnerData = {
          name: carData.name,
          color: carData.color,
          wins: winner.wins,
          bestTime: winner.time,
          id: carData.id
        };
        return winnerData;
      }
    );
    return await Promise.all(winnersData);
  }
  async createWinner(winnerObject: { id: string; wins: number; time: number }) {
    const url = baseUrl + '/winners';
    await this.makeRequest(
      url,
      'POST',
      {
        'Content-Type': 'application/json'
      },
      winnerObject
    );
  }
  async updateWinner(id: string, winnerObject: { wins: number; time: number }) {
    const url = baseUrl + `/winners/${id}`;
    await this.makeRequest(
      url,
      'PUT',
      {
        'Content-Type': 'application/json'
      },
      winnerObject
    );
  }
}
