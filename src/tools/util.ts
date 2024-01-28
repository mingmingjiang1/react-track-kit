export function setMetadata(metadataKey: string | symbol, value: any[], target: any, propertyKey?: string | symbol) {
  if (propertyKey) {
    Reflect.defineMetadata(metadataKey, value, target, propertyKey);
  } else {
    Reflect.defineMetadata(metadataKey, value, target);
  }
}

export function getMetadata(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): any[] {
  if (propertyKey) {
    return Reflect.getOwnMetadata(metadataKey, target, propertyKey);
  }

  return Reflect.getOwnMetadata(metadataKey, target);
}
