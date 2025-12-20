import {pino} from "pino"
import dayjs from "dayjs"


const isDev = process.env.NODE_ENV !== 'production'

const logger = isDev
  ? pino({
      transport: { target: 'pino-pretty' },
      timestamp: () => `,"time":"${dayjs().format()}"`,
    })
  : pino({ timestamp: () => `,"time":"${dayjs().format()}"` })


export const info = (message : string, parameter? : any) => logger.info({message, parameter});
export const error = (message : string, error?: Error) =>  logger.error({message, error});
export const debug = (message : string) => logger.debug(message);