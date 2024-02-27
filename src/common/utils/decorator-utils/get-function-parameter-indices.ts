import { ParamDecoratorEnum } from "@common/enums";

export const getFunctionParameterIndices = (target: any, property: any) => {
  return Reflect.getMetadataKeys(target, property)
    .filter((indice) => {
      const metadata = Reflect.getMetadata(indice, target, property);
      const param = metadata?.param;
      const enums = Object.values(ParamDecoratorEnum).map((value) => param ? `${value}:${param}` : value);
      return enums.includes(indice)
    })
    .map(key => Reflect.getMetadata(key, target, property))
}
