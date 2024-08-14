import { button, div, h1, section, span } from '../../../utils/tags';
import CarManagementView from './carManagementView';
import './garage.scss';

export default class GarageView {
  protected section: HTMLElement;
  protected garageContainer: HTMLElement;
  protected carsBlock: HTMLElement;
  public management: CarManagementView;
  public header: HTMLElement;
  public pageNumber: HTMLElement;
  public carsList: HTMLElement;
  public pageControlBlock: HTMLElement;
  public prevPageButton: HTMLButtonElement | null = null;
  public nextPageButton: HTMLButtonElement | null = null;

  constructor(main: HTMLElement) {
    this.section = this.drawSection(main);
    this.garageContainer = this.drawGarageContainer();
    this.management = new CarManagementView(this.garageContainer);
    this.carsBlock = this.drawCarsBlock();
    this.header = this.drawHeader();
    this.pageNumber = this.drawPageNumber();
    this.carsList = this.drawCarsList();
    this.pageControlBlock = this.drawPageControlBlock();
  }
  drawSection(main: HTMLElement) {
    return section({
      parentElement: main,
      classNames: ['garage', 'page']
    });
  }
  drawGarageContainer() {
    return div({
      parentElement: this.section,
      classNames: ['garage__container', 'container']
    });
  }
  drawCarsBlock() {
    return div({
      parentElement: this.garageContainer,
      classNames: ['garage___cars-block']
    });
  }
  drawHeader() {
    return h1({
      parentElement: this.carsBlock,
      classNames: ['garage__header']
    });
  }
  drawPageNumber() {
    return span({
      parentElement: this.carsBlock,
      classNames: ['garage__page-number']
    });
  }
  drawCarsList() {
    return div({
      parentElement: this.carsBlock,
      classNames: ['garage__cars-list']
    });
  }
  drawPageControlBlock() {
    this.prevPageButton = button({
      attr: {
        id: 'prev'
      },
      text: 'prev',
      classNames: ['garage__button']
    });

    this.nextPageButton = button({
      attr: {
        id: 'next'
      },
      text: 'next',

      classNames: ['garage__button']
    });
    return div({
      parentElement: this.garageContainer,
      classNames: ['garage__page-control-block'],
      childrenNodes: [this.prevPageButton, this.nextPageButton]
    });
  }
}
