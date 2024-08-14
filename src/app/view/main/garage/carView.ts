import './car.scss';

import { CarObject } from '../../../types';
import { button, div, img, span } from '../../../utils/tags';
import GarageView from './garageView';
import flagIcon from '../../../../assets/flag.png';
import { carIcon } from '../../../../assets/carIcon';

export default class CarView {
  protected name: string;
  protected color: string;
  protected id: number;
  protected carBlock: HTMLElement;
  public startStopCarBlock: HTMLElement | null = null;
  constructor(garageView: GarageView, car: CarObject) {
    this.name = car.name;
    this.color = car.color;
    this.id = car.id;
    this.carBlock = this.drawCarBlock(garageView);
  }
  drawCarBlock(garageView: GarageView) {
    this.startStopCarBlock = div({
      classNames: ['car__row'],
      childrenNodes: [
        button({
          text: 'A',
          classNames: ['car__action', 'car__action-start']
        }),
        button({
          text: 'B',
          classNames: ['car__action', 'car__action-stop', 'disabled']
        })
      ]
    });
    return div({
      attr: {
        id: String(this.id)
      },
      parentElement: garageView.carsList,
      classNames: ['garage__car', 'car'],
      childrenNodes: [
        div({
          classNames: ['car__row'],
          childrenNodes: [
            button({
              attr: {
                id: 'select'
              },
              text: 'select',
              classNames: ['car__button']
            }),
            button({
              attr: {
                id: 'remove'
              },
              text: 'removing',
              classNames: ['car__button']
            }),
            span({
              text: this.name,
              classNames: ['car__name']
            })
          ]
        }),
        this.startStopCarBlock,
        div({
          classNames: ['car__row', 'car__row--third'],
          childrenNodes: [
            div({
              classNames: ['car__icon'],
              innerHtml: carIcon(this.color)
            }),
            div({
              classNames: ['car__finish', 'bg'],
              childrenNodes: [
                img({
                  attr: {
                    src: flagIcon
                  }
                })
              ]
            })
          ]
        })
      ]
    });
  }
}
