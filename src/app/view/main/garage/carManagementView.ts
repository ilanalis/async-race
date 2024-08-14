import { button, div, form, input } from '../../../utils/tags';
import './carManagement.scss';

export default class CarManagementView {
  public managementBlock: HTMLElement;
  public creatingCarForm: HTMLFormElement;
  public updatingCarFrom: HTMLFormElement;
  public carsControlPanel: HTMLElement;
  public carUpdatingTextInput: HTMLInputElement | null = null;
  public carUpdatingPickColorInput: HTMLInputElement | null = null;
  public carCreatingTextInput: HTMLInputElement | null = null;
  public carCreatingPickColorInput: HTMLInputElement | null = null;
  public updateButton: HTMLButtonElement | null = null;
  public raceButton: HTMLButtonElement | null = null;
  public resetButton: HTMLButtonElement | null = null;
  constructor(container: HTMLElement) {
    this.managementBlock = this.drawManagementBlock(container);
    this.creatingCarForm = this.drawCreateBlock();
    this.updatingCarFrom = this.drawUpdateBlock();
    this.carsControlPanel = this.drawCarsControlPanel();
  }
  drawManagementBlock(container: HTMLElement) {
    return div({
      classNames: ['garage__management', 'management'],
      parentElement: container
    });
  }
  drawCreateBlock() {
    this.carCreatingTextInput = input({
      attr: { required: true },
      classNames: ['management__text-input']
    });
    this.carCreatingPickColorInput = input({
      classNames: ['management__color-input'],
      attr: {
        type: 'color'
      }
    });
    return form({
      classNames: ['management__create-update'],
      parentElement: this.managementBlock,
      childrenNodes: [
        this.carCreatingTextInput,
        this.carCreatingPickColorInput,
        button({
          text: 'CREATE',
          classNames: ['management__button', 'button']
        })
      ]
    });
  }
  drawUpdateBlock() {
    this.carUpdatingTextInput = input({
      attr: { required: true },
      classNames: ['management__text-input']
    });
    this.carUpdatingPickColorInput = input({
      classNames: ['management__color-input'],
      attr: {
        type: 'color'
      }
    });
    this.updateButton = button({
      text: 'UPDATE',
      classNames: ['management__button', 'disabled']
    });
    return form({
      classNames: ['management__create-update'],
      parentElement: this.managementBlock,
      childrenNodes: [
        this.carUpdatingTextInput,
        this.carUpdatingPickColorInput,
        this.updateButton
      ]
    });
  }
  drawCarsControlPanel() {
    this.raceButton = button({
      attr: {
        id: 'race'
      },
      text: 'RACE',
      classNames: ['management__button', 'management__button--green']
    });
    this.resetButton = button({
      attr: {
        id: 'reset'
      },
      text: 'RESET',
      classNames: ['management__button', 'management__button--green']
    });
    return div({
      parentElement: this.managementBlock,
      classNames: ['management__cars-control-panel'],
      childrenNodes: [
        this.raceButton,
        this.resetButton,
        button({
          attr: {
            id: 'generate-cars'
          },
          text: 'GENERATE CARS',
          classNames: ['management__button']
        })
      ]
    });
  }
}
