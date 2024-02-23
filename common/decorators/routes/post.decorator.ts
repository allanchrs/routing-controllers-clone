import { HttpMethodEnum } from "../../enums"
import { interceptor } from "../../interceptors/request.interceptor"
import { RouteDecoratorInput, baseHttpDecorator } from "./base.decorator"

export const Post = (input?: RouteDecoratorInput) => {
  return baseHttpDecorator({ ...input, method: HttpMethodEnum.POST, interceptor })
}

