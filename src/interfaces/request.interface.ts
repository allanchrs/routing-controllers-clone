import { IncomingMessage } from "http";

export interface IRequest<Body = any, Params = any, Query = any> extends IncomingMessage {
  [key: string]: any;
  body?: Body
  params?: Params
  query?: Query
}