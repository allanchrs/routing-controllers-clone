import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  colorize: true,
  ignore: 'pid,hotname,address,port',
  colorizeObjects: true
})

export const logger = pino(stream) 