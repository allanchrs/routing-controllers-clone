import 'reflect-metadata'
import { ParamDecoratorEnum } from '../../enums';

export const Res = () => {
  return (target: Object, key: string | symbol, index: number) => {
    Reflect.defineMetadata(ParamDecoratorEnum.RES, index, target, key);
  };
}