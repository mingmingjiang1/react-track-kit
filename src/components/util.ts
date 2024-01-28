import React from "react";
import { Dispatcher } from "../tools/dispatcher";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {
  
};

export function AddEvent<P, E>(
  ele,
  cls: string[],
  path: string[],
  hijacks?: string[],
  params?: P,
  extra?: E
) {
  const _instance = Dispatcher.getInstance();

  const tmp = {};

  hijacks?.forEach((hijackEvent, index) => {
    Object.assign(tmp, {
      [hijackEvent]: (...args) => {

        const originEvent = ele.props?.[hijackEvent] || noop;

        originEvent.apply(ele, args);

        _instance.dispatch(cls?.[index], path?.[index], params || {}, extra || args || {}); // class name, params, method name
      },
    });
  });

  return React.cloneElement(ele, tmp);
}

export function findHtmlElement<P, E>(
  ele,
  cls: string[],
  path: string[],
  hijacks?: string[],
  params?: P,
  extra?: E
) {
  if (typeof ele.type === 'function') {
    if (ele.type.prototype instanceof React.Component) {
      ele = new ele.type(ele.props).render();
    } else {
      ele = ele.type(ele.props);
    }
  }

  return AddEvent(ele, cls, path, hijacks, params, extra);
}