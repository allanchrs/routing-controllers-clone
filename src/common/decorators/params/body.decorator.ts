import 'reflect-metadata';
import { ParamDecoratorEnum } from '../../enums';

/**
 * Decorator function for extracting the request body in a controller method.
 * @returns A decorator function.
 */
export const Body = () => {
  /**
   * Actual decorator function that sets metadata for the body parameter.
   * @param target The target object (prototype) of the class.
   * @param key The name of the method.
   * @param index The index of the parameter.
   */
  return (target: Object, key: string | symbol, index: number) => {
    Reflect.defineMetadata(ParamDecoratorEnum.BODY, { index, key: ParamDecoratorEnum.BODY }, target, key);
  };
}
