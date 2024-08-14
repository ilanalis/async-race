export interface tagAttr {
  [key: string]: string | boolean | Function | undefined;
  src?: string;
  dataset?: string;
  id?: string;
}
export interface TagCreatorProps {
  attr?: tagAttr;
  text?: string;
  innerHtml?: string;
  classNames?: string[] | [];
  parentElement?: HTMLElement;
  childrenNodes?: HTMLElement[];
}
export interface ElementProps extends TagCreatorProps {
  tag: string;
}

export interface Route {
  path: string;
  callback: Function;
}
export interface CarObject {
  name: string;
  color: string;
  id: number;
}

export interface WinnerObject {
  name: string;
  color: string;
  wins: number;
  bestTime: number;
  id: string;
}
export interface updatingCarObject {
  name: string;
  color: string;
}
