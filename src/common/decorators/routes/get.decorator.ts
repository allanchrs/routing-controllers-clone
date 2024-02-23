import { HttpMethodEnum } from "../../enums"
import { RouteDecoratorInput, baseHttpDecorator } from "./base.decorator"

export const Get = (input?: RouteDecoratorInput) => {
  return baseHttpDecorator({ ...input, method: HttpMethodEnum.GET })
}