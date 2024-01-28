import { findHtmlElement } from "./util";
import React, { ReactNode } from "react";

export type TrackCompProps<P, E> = {
  cls: string[];
  extra?: E;
  children?: ReactNode;
  params?: P;
  hijacks: string[];
  path: string[];
};

export const TrackComp = <P, E>(
  { cls, extra, children, hijacks, params, path }: TrackCompProps<P, E>
) => {
  return findHtmlElement(React.Children.only(children), cls, path, hijacks, params, extra);
};

/* const _TrackCompV2 = <P, E>(
  { children, hijacks, events, extra, cls }: TrackCompProps<P, E>,
  ref: React.ForwardedRef<unknown>
) => {
  const _instance = Dispatcher.getInstance();

  const handleClick = (_cls, path, _params) => {

    _instance.dispatch(_cls, path, _params || {}, extra); // class name, params, method name
  };

  function _findHtmlElement(
    ele,
    _events: string[],
    _hijacks?: string[],
    _extra?: IMutableObject,
    _ref?: React.ForwardedRef<unknown>
  ) {
    const tmp = {};

    hijacks?.forEach((hijackEvent, index) => {
      if (typeof ele === 'function') {
        if (ele?.type?.prototype instanceof React.Component) {
          ele = new ele.type(ele.props).render();
        } else {
          ele = ele({ handleClick: handleClick.bind(null, cls?.[index], events?.[index]) });
        }
      }

      Object.assign(tmp, {
        [hijackEvent]: (...args) => {
          const originEvent = ele.props?.[hijackEvent] || noop;

          originEvent.apply(ele, args);
        },
      });
    });

    return React.cloneElement(ele, tmp);
  }

  return _findHtmlElement(children, events, hijacks, {});
};

export const TrackCompV2 = forwardRef(_TrackCompV2); */