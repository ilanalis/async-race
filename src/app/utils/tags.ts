import { TagCreatorProps } from '../types';
import ElementCreator from './elementCreator';

export const header = (props: TagCreatorProps): HTMLElement => {
  const elementCreator = new ElementCreator({
    tag: 'header',
    ...props
  });
  return elementCreator.getElement();
};

export const main = (props: TagCreatorProps): HTMLElement => {
  const elementCreator = new ElementCreator({
    tag: 'main',
    ...props
  });
  return elementCreator.getElement();
};

export const section = (props: TagCreatorProps): HTMLElement => {
  const elementCreator = new ElementCreator({
    tag: 'section',
    ...props
  });
  return elementCreator.getElement();
};

export const nav = (props: TagCreatorProps): HTMLElement => {
  const elementCreator = new ElementCreator({
    tag: 'nav',
    ...props
  });
  return elementCreator.getElement();
};

export const div = (props: TagCreatorProps): HTMLElement => {
  const elementCreator = new ElementCreator({
    tag: 'div',
    ...props
  });
  return elementCreator.getElement();
};

export const img = (props: TagCreatorProps): HTMLElement => {
  const elementCreator = new ElementCreator({
    tag: 'img',
    ...props
  });
  return elementCreator.getElement();
};

export const svg = (props: TagCreatorProps): HTMLElement => {
  const elementCreator = new ElementCreator({
    tag: 'svg',
    ...props
  });
  return elementCreator.getElement();
};
export const use = (props: TagCreatorProps): HTMLElement => {
  const elementCreator = new ElementCreator({
    tag: 'use',
    ...props
  });
  return elementCreator.getElement();
};

export const h1 = (props: TagCreatorProps): HTMLElement => {
  const elementCreator = new ElementCreator({
    tag: 'h1',
    ...props
  });
  return elementCreator.getElement();
};

export const h2 = (props: TagCreatorProps): HTMLElement => {
  const elementCreator = new ElementCreator({
    tag: 'h2',
    ...props
  });
  return elementCreator.getElement();
};

export const form = (props: TagCreatorProps): HTMLFormElement => {
  const elementCreator = new ElementCreator<HTMLFormElement>({
    tag: 'form',
    ...props
  });
  return elementCreator.getElement();
};

export const label = (props: TagCreatorProps): HTMLElement => {
  const elementCreator = new ElementCreator({
    tag: 'label',
    ...props
  });
  return elementCreator.getElement();
};

export const input = (props: TagCreatorProps): HTMLInputElement => {
  const elementCreator = new ElementCreator<HTMLInputElement>({
    tag: 'input',
    ...props
  });
  return elementCreator.getElement();
};

export const button = (props: TagCreatorProps): HTMLButtonElement => {
  const elementCreator = new ElementCreator<HTMLButtonElement>({
    tag: 'button',
    ...props
  });
  return elementCreator.getElement();
};

export const span = (props: TagCreatorProps): HTMLElement => {
  const elementCreator = new ElementCreator({
    tag: 'span',
    ...props
  });
  return elementCreator.getElement();
};
export const p = (props: TagCreatorProps): HTMLElement => {
  const elementCreator = new ElementCreator({
    tag: 'p',
    ...props
  });
  return elementCreator.getElement();
};
