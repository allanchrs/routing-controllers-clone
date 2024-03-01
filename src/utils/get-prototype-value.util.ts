/**
 * Retrieves a specific property value from the prototype chain of an object.
 * @param value The input object from which to retrieve the property value.
 * @returns The value of the specified property from the prototype chain.
 */
export const getPrototypeValue = <Input, Output>(value: Input): Output => {
  return Object.getOwnPropertyDescriptors(value).prototype.value as Output;
};
