type RequestParams = {
  path?: string;
  resource?: string;
};

export default class HistoryRouterHandler {
  protected callback: Function;
  protected handler: (event: PopStateEvent) => void;

  constructor(callback: Function) {
    this.callback = callback;
    this.handler = this.navigate.bind(this);
    window.addEventListener('popstate', this.handler);
  }
  navigate(urlOrEvent: string | PopStateEvent | null) {
    if (typeof urlOrEvent === 'string') {
      const url: string[] = window.location['pathname'].slice(1).split('/');

      if (url.length > 1) {
        this.setHistory('/ilanalis-JSFE2023Q4/async-race/' + urlOrEvent); // for deploy version
      } else {
        this.setHistory('/' + urlOrEvent);
      }
    }
    const urlString: string[] = window.location['pathname'].slice(1).split('/');
    let urlStringForPath: string[];
    if (urlString.length > 2) {
      urlStringForPath = urlString.slice(2); // for deploy version
    } else {
      urlStringForPath = urlString.slice(0);
    }
    const result: RequestParams = {};

    [result.path = ''] = urlStringForPath;

    this.callback(result);
  }
  setHistory(url: string) {
    window.history.pushState(null, '', `${url}`);
  }
}
