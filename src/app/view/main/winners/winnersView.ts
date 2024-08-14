import { button, div, h1, section, span } from '../../../utils/tags';
import './winners.scss';

export default class WinnersView {
  protected section: HTMLElement;
  protected winnersContainer: HTMLElement;
  protected winnersBlock: HTMLElement;
  public header: HTMLElement;
  public pageNumber: HTMLElement;
  public winnersTable: HTMLElement;
  public tableHeader: HTMLElement;
  public winnersList: HTMLElement;
  public pageControlBlock: HTMLElement;
  public prevPageButton: HTMLButtonElement | null = null;
  public nextPageButton: HTMLButtonElement | null = null;

  constructor(main: HTMLElement) {
    this.section = this.drawSection(main);
    this.winnersContainer = this.drawWinnersContainer();
    this.winnersBlock = this.drawWinnersBlock();
    this.header = this.drawHeader();
    this.pageNumber = this.drawPageNumber();
    this.winnersTable = this.drawWinnersTable();
    this.tableHeader = this.drawTableHeaders();
    this.winnersList = this.drawWinnersList();
    this.pageControlBlock = this.drawPageControlBlock();
  }
  drawSection(main: HTMLElement) {
    return section({
      classNames: ['winners'],
      parentElement: main
    });
  }
  drawWinnersContainer() {
    return div({
      parentElement: this.section,
      classNames: ['winners__container', 'container']
    });
  }
  drawWinnersBlock() {
    return div({
      parentElement: this.winnersContainer,
      classNames: ['winners__winners-block']
    });
  }
  drawHeader() {
    return h1({
      text: 'Winners',
      parentElement: this.winnersBlock,
      classNames: ['winners__header']
    });
  }
  drawPageNumber() {
    return span({
      text: 'Page 1',
      parentElement: this.winnersBlock,
      classNames: ['winners__page-number']
    });
  }
  drawWinnersTable() {
    return div({
      parentElement: this.winnersBlock,
      classNames: ['winners__winners-table', 'table']
    });
  }
  drawTableHeaders() {
    return div({
      parentElement: this.winnersTable,
      classNames: ['table__row'],
      childrenNodes: [
        div({
          text: '№',
          classNames: ['table__column', 'table__column-1']
        }),
        div({
          text: 'car',
          classNames: ['table__column', 'table__column-2']
        }),
        div({
          text: 'name',
          classNames: ['table__column', 'table__column-3']
        }),
        div({
          text: 'wins',
          classNames: ['table__column', 'table__column-4']
        }),
        div({
          text: 'best time',
          classNames: ['table__column', 'table__column-5']
        })
      ]
    });
  }
  drawWinnersList() {
    return div({
      parentElement: this.winnersTable,
      classNames: ['winners__winners-list', 'table']
    });
  }
  drawPageControlBlock() {
    this.prevPageButton = button({
      attr: {
        id: 'prev'
      },
      text: 'prev',
      classNames: ['winners__button']
    });

    this.nextPageButton = button({
      attr: {
        id: 'next'
      },
      text: 'next',

      classNames: ['winners__button']
    });
    return div({
      parentElement: this.winnersContainer,
      classNames: ['winners__page-control-block'],
      childrenNodes: [this.prevPageButton, this.nextPageButton]
    });
  }
}
