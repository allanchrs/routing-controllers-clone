import 'reflect-metadata';
import { ParamDecoratorEnum } from '../../enums';

/**
 * Decorator function for extracting route parameters in a controller method.
 * @param param The name of the route parameter.
 * @returns A decorator function.
 */
export const Param = (param: string) => {
  /**
   * Actual decorator function that sets metadata for the route parameter.
   * @param target The target object (prototype) of the class.
   * @param key The name of the method.
   * @param index The index of the parameter.
   */
  return (target: Object, key: string | symbol, index: number) => {
    Reflect.defineMetadata(`${ParamDecoratorEnum.PARAM}:${param}`, { index, param, key: ParamDecoratorEnum.PARAM }, target, key);
  };
}
