import 'reflect-metadata'
import { ParamDecoratorEnum } from '../../enums';

export const Param = (param: string) => {
  return (target: Object, key: string | symbol, index: number) => {
    Reflect.defineMetadata(`${ParamDecoratorEnum.PARAM}:${param}`, { index, param, key: ParamDecoratorEnum.PARAM }, target, key);
  };
}