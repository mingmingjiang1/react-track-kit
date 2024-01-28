import { Container, Provider } from './container';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
// export interface IHandler {}

export type Config<T> = {
  sharedCls?: string;
  params: T;
};

export class Dispatcher {
  static queue: Array<(...args: any) => any> = [];
  static instance: Dispatcher;
  static sharedCls: string;

  static container: Container = new Container();

  // static register(key, value) {
  //   // 自动绑定handler
  //   Dispatcher.map.set(key, value);
  // }

  static getInstance<U>(config?: Config<U>): Dispatcher {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { params, sharedCls } = config || {};

    console.log(sharedCls, 'sharedCls')

    if (!Dispatcher.instance) {
      Dispatcher.container.inject(sharedCls || 'default', new Provider('value', params));
      // if (!config) {
      //   throw Error('Unexpected initialize class <Dispatcher> not in getInstance Function');
      // }

      Dispatcher.instance = new Dispatcher();
      Dispatcher.sharedCls = sharedCls || 'default';

      // if (Common) {
      //   Dispatcher.singleCommon = new Common();
      // }

      // config?.handlers?.forEach(_H => {
      //   Dispatcher.register(
      //     _H.name,
      //     new Function('handler', 'params', 'handlers', 'return new handler(params, handlers)')(
      //       eval(_H),
      //       params || {},
      //       Dispatcher.map
      //     )
      //   );
      // });
    }

    return Dispatcher.instance;
  }

  static setConfig(params: Record<string, any>) {
    // 修改公共参数
    const sharedCls = Dispatcher.container.get(Dispatcher.sharedCls) as any;

    Object.assign(sharedCls, {
      ...params,
    });
  }

  dispatch(cls: string, path: string, params, extra) {
    console.log('执行顺序同步dispatch', Dispatcher.container, cls, params, extra);
    const _handlerCls = Dispatcher.container.get(cls);
    // const _handlerCls = Dispatcher.map.get(cls);
    const fn = _handlerCls?.[path];

    if (!fn) {
      throw Error(
        `method ${path} not in ${cls}, 
        maybe ${cls} is not registered or check your method name`
      );
    }

    return fn?.call(_handlerCls, params, extra);
  }

  run() {
    const report = deadline => {
      while (deadline.timeRemaining() >= 10 && Dispatcher.queue.length > 0) {
        const t = Dispatcher?.queue.shift();

        t?.();
      }

      if (Dispatcher?.queue.length) {
        console.log('执行异步dispatch');
        requestIdleCallback(report);
      }
    };

    requestIdleCallback(report);
  }

  asyncDispatch(cls: string, path: string, params, extra) {
    const _handlerCls = Dispatcher.container.get(cls);

    // const _handlerCls = Dispatcher.map.get(cls);
    const fn = _handlerCls?.[path];

    if (!fn) {
      throw Error(
        `method ${path} not in ${cls}, 
        maybe ${cls} is not registered or check your method name`
      );
    }

    Dispatcher.queue.push(
      fn.bind(_handlerCls, params, {
        ...(extra || {}),
        now: Date.now(),
      })
    );

    this.run();
  }
}
