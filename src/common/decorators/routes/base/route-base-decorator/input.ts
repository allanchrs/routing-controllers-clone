import { HttpMethodEnum } from "@common/enums"
import { IMiddleware } from "@interfaces/middleware.interface"

export type Input<T extends IMiddleware = IMiddleware> = {
  middlewares?: (new () => T)[]
  method: HttpMethodEnum,
  path?: string,
  status?: number,
  interceptor?: (input: Partial<Input>) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void
}