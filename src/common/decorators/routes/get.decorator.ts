import { HttpMethodEnum } from "../../enums"
import { RouteDecoratorInput, baseHttpDecorator } from "./base.decorator"
import { interceptor } from "../../interceptors/request.interceptor"

export const Get = (input?: RouteDecoratorInput) => {
  return baseHttpDecorator({ ...input, method: HttpMethodEnum.GET, interceptor })
}