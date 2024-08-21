import { Route } from '../types';
import HistoryRouterHandler from './handler/history-router-handler';

export default class Router {
  protected routes: Route[];
  protected handler: HistoryRouterHandler | null = null;
  constructor(routes: Route[]) {
    this.routes = routes;

    if (this.handler) {
      this.handler.removeListener();
    }

    this.handler = new HistoryRouterHandler(this.urlChangedHandler.bind(this));

    if (document.readyState !== 'loading') {
      this.handler.navigate(null);
    }
  }
  navigate(url: string | null) {
    if (!this.handler) return;

    this.handler.navigate(url);
  }
  urlChangedHandler(requestParams: { path: string }) {
    const pathForFind = requestParams.path;
    const route: Route | undefined = this.routes.find(
      (item) => item.path === pathForFind,
    );

    if (!route) {
      this.redirectToNotFoundPage();
      return;
    }

    route.callback();
  }
  redirectToNotFoundPage() {
    const notFoundPage = this.routes.find((item) => item.path === 'not-found');
    if (notFoundPage) {
      this.navigate(notFoundPage.path);
    }
  }
}
