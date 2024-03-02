import { HttpMethodEnum } from "@common/enums"

export type Input = {
  method: HttpMethodEnum,
  path?: string,
  status?: number,
  interceptor?: (input: Partial<Input>) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void
}