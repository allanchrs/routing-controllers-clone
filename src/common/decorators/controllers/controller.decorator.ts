export const Controller = (path?: string) => {
  return (constructor: Function) => {
    constructor.prototype.prefix = path
  }
}