import 'reflect-metadata';
import { ParamDecoratorEnum } from '../../enums';

/**
 * Decorator function for extracting the socket object in a controller method.
 * @returns A decorator function.
 */
export const Socket = () => {
  /**
   * Actual decorator function that sets metadata for the socket object.
   * @param target The target object (prototype) of the class.
   * @param key The name of the method.
   * @param index The index of the parameter.
   */
  return (target: Object, key: string | symbol, index: number) => {
    Reflect.defineMetadata(ParamDecoratorEnum.SOCKET, { index, key: ParamDecoratorEnum.SOCKET }, target, key);
  };
}
