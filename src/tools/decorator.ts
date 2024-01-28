import { CLASS_CONSTRUCTOR_ARGS, TYPE } from './constant';
import { Provider } from './container';
import { Dispatcher } from './dispatcher';
import { Token } from './type';
import { getMetadata, setMetadata } from './util';

export function Value(token?: Token): PropertyDecorator {
  return (target, propertyKey) => {
    const type = Reflect.getMetadata(TYPE, target, propertyKey);

    const metadata = getMetadata(CLASS_CONSTRUCTOR_ARGS, target.constructor) || [];
    metadata.push({
      id: propertyKey,
      prop: token ?? (typeof type === 'function' ? type.name : type),
      // target: target.constructor.name,
    });

    setMetadata(CLASS_CONSTRUCTOR_ARGS, metadata, target.constructor);
  };
}

export function Inject(token?: Token): PropertyDecorator {
  return (target, propertyKey) => {
    const type = Reflect.getMetadata(TYPE, target, propertyKey);

    Object.defineProperty(target, propertyKey, {
      get() {
        return Dispatcher.container.get(token ?? (typeof type === 'function' ? type.name : type));
      },
    });
  };
}

export function LazyInject(token?: Token): PropertyDecorator {
  return (target, propertyKey) => {

    const type = Reflect.getMetadata(TYPE, target, propertyKey);
    console.log('lazyInject====>', token ?? (typeof type === 'function' ? type.name : type));
    const metadata = getMetadata(CLASS_CONSTRUCTOR_ARGS, target.constructor) || [];

    metadata.push({
      id: propertyKey,
      prop: token ?? (typeof type === 'function' ? type.name : type),
      // target: target.constructor.name,
    });

    setMetadata(CLASS_CONSTRUCTOR_ARGS, metadata, target.constructor);

    // Dispatcher.container.push(target.constructor.name, () => {
    //   Object.defineProperty(Dispatcher.container.get(target.constructor.name), propertyKey, {
    //     get() {
    //       return Dispatcher.container.get(token ?? typeof type === 'function' ? type.name : type);
    //     },
    //   });
    // });
  };
}

export function LazyInjectable(token?: Token): ClassDecorator {
  return target => {
    console.log(Dispatcher.container, 2222)
    // 用token 或者用类作key
    Dispatcher.container.inject(token ?? target.name, new Provider('class', target));

    const metas = getMetadata(CLASS_CONSTRUCTOR_ARGS, target);

    if (metas) {
      metas.forEach(({ prop, id }) => {
        console.log(33333, token, prop === 'Object' ? id : prop, prop)
        Object.defineProperty(Dispatcher.container.get(token ?? target.name), id, {
          get() {
            return Dispatcher.container.get(prop === 'Object' ? id : prop);
          },
        });
      });
    }
  };
}
