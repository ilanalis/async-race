import { ElementProps } from '../types';

export default class ElementCreator<T extends HTMLElement = HTMLElement> {
  protected element: T;
  constructor(props: ElementProps) {
    const element = document.createElement(props.tag ? props.tag : 'div') as T;
    Object.assign(element, props.attr);

    this.element = element;
    for (const key in props.attr) {
      const value = props.attr[key];
      if (typeof value === 'string') {
        element.setAttribute(key, value);
      } else if (typeof value === 'boolean' && value) {
        element.setAttribute(key, '');
      }
    }
    if (props.classNames?.length) {
      this.setClassNames(props.classNames);
    }
    if (props.parentElement) {
      this.appendElement(props.parentElement);
    }
    if (props.text) {
      this.addText(props.text);
    }
    if (props.innerHtml) {
      this.addInnerHtml(props.innerHtml);
    }
    props.childrenNodes?.forEach((node) => {
      if (!node.parentElement && node instanceof HTMLElement) {
        this.element.appendChild(node);
      }
    });
  }
  public getElement() : T{
    return this.element;
  }
  protected setClassNames(classNames: string[]) {
    classNames.forEach((className) => {
      this.element?.classList.add(className);
    });
  }
  protected appendElement(parentElement: HTMLElement) {
    if (this.element) {
      parentElement.appendChild(this.element);
    }
  }
  protected appendChildren(children: HTMLElement[]) {
    children.forEach((child) => {
      this.element?.appendChild(child);
    });
  }
  protected addText(text: string) {
    this.element.textContent = text;
  }
  addInnerHtml(inner: string) {
    this.element.innerHTML = inner;
  }
}
