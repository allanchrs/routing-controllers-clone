export const getPrototypeValue = <Input, Output>(value: Input): Output => {
  return Object.getOwnPropertyDescriptors(value).prototype.value as Output
}