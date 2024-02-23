import 'reflect-metadata'
import { ParamDecoratorEnum } from '../../enums';

export const Socket = () => {
  return (target: Object, key: string | symbol, index: number) => {
    Reflect.defineMetadata(ParamDecoratorEnum.SOCKET, index, target, key);
  };
}