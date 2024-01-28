import { IProvider, Token } from './type';

export class Provider<T> implements IProvider {
  constructor(public readonly type: 'class' | 'value', public readonly value: T) {}
}

export class Container {
  private map = new Map<Token, IProvider>();

  inject(token: Token, provider: IProvider) {
    this.map.set(token, provider);
  }

  get<T>(token: Token): T {
    const { map } = this;

    if (map.has(token)) {
      const provider = map.get(token)!;

      if (provider.type === 'value') {
        return provider.value;
      }

      if (provider.type === 'class') {
        if (provider.instance) {
          return provider.instance;
        }

        const instance = new provider.value();
        provider.instance = instance;
        return instance;
      }

      throw new Error('unknown type: ' + provider.type);
    } else {
      console.log(3333333, map);
      throw new Error('unknown token: ' + token.toString());
    }
  }
}
