import Router from './router/router';
import State from './state/state';
import { Route } from './types';
import HeaderView from './view/header/header-view';
import GarageView from './view/main/garage/garageView';
import MainView from './view/main/main';
import NotFoundView from './view/main/not-found/not-found-view';
import WinnersView from './view/main/winners/winnersView';

export default class App {
  protected headerView: HeaderView | null = null;
  protected mainView: MainView | null = null;
  protected router: Router | null = null;
  protected state: State | null = null;

  constructor() {
    this.initialize();
  }
  async initialize() {
    if (this.state) {
      this.state.removeListener();
    }

    this.state = new State();
    await this.state.start();
    const routes: Route[] = this.createRoutes(this.state);
    this.router = new Router(routes);
    this.createView();
  }
  createView() {
    if (this.router) {
      if (this.headerView) {
        this.headerView.removeListeners();
      }

      this.headerView = new HeaderView(this.router);
      this.mainView = new MainView();
    }
  }
  createRoutes(state: State) {
    return [
      {
        path: '',
        callback: async () => {
          const { default: GarageView } = await import(
            './view/main/garage/garageView'
          );
          if (this.mainView && this.mainView.main) {
            this.setContent('garage', GarageView, state);
          }
        },
      },
      {
        path: 'garage',
        callback: async () => {
          const { default: GarageView } = await import(
            './view/main/garage/garageView'
          );
          if (this.mainView && this.mainView.main) {
            this.setContent('garage', GarageView, state);
          }
        },
      },
      {
        path: 'winners',
        callback: async () => {
          const { default: WinnersView } = await import(
            './view/main/winners/winnersView'
          );
          if (this.mainView && this.mainView.main) {
            this.setContent('winners', WinnersView, state);
          }
        },
      },
      {
        path: `not-found`,
        callback: async () => {
          const { default: NotFoundView } = await import(
            './view/main/not-found/not-found-view'
          );
          if (this.mainView && this.mainView.main) {
            this.setContent('not-found', NotFoundView, state);
          }
        },
      },
    ];
  }
  setContent(
    page: string,
    view: typeof NotFoundView | typeof GarageView | typeof WinnersView,
    state: State,
  ) {
    this.headerView?.setSelectedItem(page);
    this.mainView?.setContent(view, state, page);
  }
}
