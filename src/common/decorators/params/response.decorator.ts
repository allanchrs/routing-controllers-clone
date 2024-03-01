import 'reflect-metadata';
import { ParamDecoratorEnum } from '../../enums';

/**
 * Decorator function for extracting the response object in a controller method.
 * @returns A decorator function.
 */
export const Res = () => {
  /**
   * Actual decorator function that sets metadata for the response object.
   * @param target The target object (prototype) of the class.
   * @param key The name of the method.
   * @param index The index of the parameter.
   */
  return (target: Object, key: string | symbol, index: number) => {
    Reflect.defineMetadata(ParamDecoratorEnum.RES, { index, key: ParamDecoratorEnum.RES }, target, key);
  };
}
