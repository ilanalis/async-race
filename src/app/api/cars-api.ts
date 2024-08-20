import { CarObject, updatingCarObject } from '../types';
import { baseUrl, maxCarCountOnPage } from '../utils/const';
import Api from './api';

export default class CarsApi extends Api {
  protected controller: AbortController | null = null;

  async getCars(page?: number): Promise<CarObject[]> {
    if (page) {
      const url = baseUrl + `/garage?_page=${page}&_limit=${maxCarCountOnPage}`;
      const cars = await this.makeRequest<CarObject[]>(url);

      return cars;
    } else {
      const url = baseUrl + '/garage';
      const cars = await this.makeRequest<CarObject[]>(url);

      return cars;
    }
  }

  async removeCar(id: string) {
    const url = baseUrl + `/garage/${id}`;
    await this.makeRequest<CarObject>(url, 'DELETE');
  }

  async createCar(carData: CarObject) {
    const url = baseUrl + `/garage`;
    await this.makeRequest<CarObject>(
      url,
      'POST',
      {
        'Content-Type': 'application/json',
      },
      carData,
    );
  }

  async getCar(id: string) {
    const url = baseUrl + `/garage/${id}`;
    const car = await this.makeRequest<CarObject>(url);

    return car;
  }

  async updateCar(id: string, updatingCarObject: updatingCarObject) {
    const url = baseUrl + `/garage/${id}`;
    await this.makeRequest<CarObject>(
      url,
      'PUT',
      {
        'Content-Type': 'application/json',
      },
      updatingCarObject,
    );
  }

  async startCar(id: string) {
    const url = baseUrl + `/engine/?id=${id}&status=started`;
    const carData = await this.makeRequest<CarObject>(url, 'PATCH');

    return carData;
  }

  async stopCar(id: string) {
    const url = baseUrl + `/engine/?id=${id}&status=stopped`;
    await this.makeRequest(url, 'PATCH');
    if (this.controller) {
      this.controller.abort();
    }
  }

  async driveModeOn(id: string) {
    this.controller = new AbortController();
    this.signal = this.controller.signal;
    const url = baseUrl + `/engine/?id=${id}&status=drive`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        signal: this.signal,
      });

      if (!response.ok) {
        if (response.status === 500) {
          return {
            success: false,
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
          success: false,
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
}
