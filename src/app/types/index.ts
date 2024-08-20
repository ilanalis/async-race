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
  velocity?: number;
  distance?: number;
}

export interface WinnerObject {
  name: string;
  color: string;
  wins: number;
  id: number;
  time: number;
}
export interface updatingCarObject {
  name: string;
  color: string;
}
