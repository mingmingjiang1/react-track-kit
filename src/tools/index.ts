import { Config, Dispatcher } from './dispatcher';

/**
 *
 * @param config
 * @param params common params
 */
export function initConfig<T>(config: Config<T>) {
  const _instance = Dispatcher.getInstance(config);

  _instance.run();
}

export function customTrack(cls: string, fn: string, params, extra?) {
  const _instance = Dispatcher.getInstance();

  _instance.dispatch(cls, fn, params || {}, extra || {});
}

export function setConfig<T extends Record<string, any>>(params: T) {
  // 修改公共参数
  Dispatcher.setConfig(params);
  // Dispatcher.container.inject(Dispatcher.sharedCls, new Provider('value', params))
}

export { LazyInject, Value, Inject, LazyInjectable } from './decorator';
