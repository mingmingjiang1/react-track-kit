export type Constructor<T = any> = new (...args: any) => T;

export type Token = string | symbol | Constructor;
export interface IProvider {
  type: 'class' | 'value';
  value: any;
  instance?: any;
}
