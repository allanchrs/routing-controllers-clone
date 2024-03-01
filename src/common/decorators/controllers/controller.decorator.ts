/**
 * Decorator function for defining a controller.
 * @param path Optional path prefix for the controller.
 * @returns A decorator function.
 */
export const Controller = (path?: string) => {
  /**
   * Actual decorator function that sets the prefix property on the constructor's prototype.
   * @param constructor The constructor function of the controller.
   */
  return (constructor: Function) => {
    constructor.prototype.prefix = path;
  }
}
