import { ParamDecoratorEnum } from "@common/enums";

/**
 * Retrieves the indices of function parameters decorated with specific metadata.
 * @param target The object instance containing the method.
 * @param property The name of the method.
 * @returns An array of objects containing the indices and metadata of the decorated parameters.
 */
export const getFunctionParameterIndices = (target: any, property: any) => {
  return Reflect.getMetadataKeys(target, property)
    .filter((indice) => {
      // Retrieve metadata for the current key
      const metadata = Reflect.getMetadata(indice, target, property);
      // Extract the 'param' property from the metadata
      const param = metadata?.param;
      // Create an array of enums with optional parameters included
      const enums = Object.values(ParamDecoratorEnum).map((value) => param ? `${value}:${param}` : value);
      // Filter metadata keys based on enum inclusion
      return enums.includes(indice);
    })
    .map(key => Reflect.getMetadata(key, target, property));
};
