import 'reflect-metadata'
import { ParamDecoratorEnum } from '../../enums';

export const Body = () => {
  return (target: Object, key: string | symbol, index: number) => {
    Reflect.defineMetadata(ParamDecoratorEnum.BODY, index, target, key);
  };
}