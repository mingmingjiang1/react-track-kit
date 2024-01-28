import { noop } from 'lodash';
import React, { ReactNode } from 'react';
import { Dispatcher } from '../tools';


export type TrackCompProps<P, E> = {
  cls: string[];
  extra?: E;
  children?: ReactNode;
  params?: P;
  hijacks: string[];
  events: string[];
  path?: string[];
  token?: symbol;
};

function AddEventAsync<P, E>({
  ele,
  cls,
  events,
  hijacks,
  params,
  extra,
}: TrackCompProps<P, E> & {
  ele;
}) {
  const _instance = Dispatcher.getInstance();

  const tmp = {};

  console.log(233333, hijacks, events);

  hijacks?.forEach((hijackEvent, index) => {
    Object.assign(tmp, {
      [hijackEvent]: async e => {
        const originEvent = ele?.props?.[hijackEvent] || noop;

        await originEvent.call(ele, e);

        console.log('转单ending');

        _instance.dispatch(cls?.[index], events[index], params || {}, extra || {}); // class name, params, method name
      },
    });
  });

  return React.cloneElement(ele, tmp);
}



function findHtmlElementAsync<P, E>(value: TrackCompProps<P, E> & { ele: ReactNode }) {
  return AddEventAsync(value);
}

/* interface IProps<ItemT extends keyof Test> {
  path?: string;
  cls: string[];
  extra?: Parameters<Test[ItemT]>[0];
  children: React.ReactNode;
  events: string[];
  hijacks?: string[];
} */

/*
 * hijacks: 劫持的目标组件事件列表
 * events: 需要绑定的Handler事件列表, 元素必须符合规范: '[prefix].[methodName]'
 */

/* const TrackClickV1 = <T extends keyof Test>({ cls, extra, children, hijacks, events }: IProps<T>, ref) => {
  return findHtmlElement(React.Children.only(children), cls, events, hijacks, extra, ref);
};

export const TrackClick = forwardRef(TrackClickV1) as <T extends keyof Test = any>(
  props: IProps<T> & { ref?: React.ForwardedRef<HTMLUListElement> }
) => ReturnType<typeof TrackClickV1>;
 */



export const TrackClickAsync = <P, E>({ extra, params, children, hijacks = [], events, cls }: TrackCompProps<P, E>) => {
  return findHtmlElementAsync({ cls, ele: React.Children.only(children), events, hijacks, params, extra });
};

export { TrackComp } from './tracker-comp';
export { TrackExposure, TrackExposureV2 } from './tracker-exposure';
export { PageActiveChange } from './tracker-page';

