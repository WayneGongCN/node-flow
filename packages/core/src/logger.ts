import log4js from 'log4js'
import path from 'path'
import { conf } from './storage'


const getLogFilePath = (file: string) => path.join(conf.get('logDir'), file)


log4js.configure({
  appenders: {
    out: { type: 'stdout' },

    errorFile: { type: 'dateFile', filename: getLogFilePath('err.log'), pattern: 'yyyy-MM-dd', compress: true, numBackups: 3 },
    warnFile: { type: 'dateFile', filename: getLogFilePath('warn.log'), pattern: 'yyyy-MM-dd', compress: true, numBackups: 3 },
    infoFile: { type: 'dateFile', filename: getLogFilePath('info.log'), pattern: 'yyyy-MM-dd', compress: true, numBackups: 2 },
    debugFile: { type: 'dateFile', filename: getLogFilePath('debug.log'), pattern: 'yyyy-MM-dd', compress: true, numBackups: 1 },
    traceFile: { type: 'dateFile', filename: getLogFilePath('trace.log'), pattern: 'yyyy-MM-dd', compress: true, numBackups: 1 },

    error: { type: 'logLevelFilter', appender: 'errorFile', level: 'error' },
    warn: { type: 'logLevelFilter', appender: 'warnFile', level: 'warn' },
    info: { type: 'logLevelFilter', appender: 'infoFile', level: 'info' },
    debug: { type: 'logLevelFilter', appender: 'debugFile', level: 'debug' },
    trace: { type: 'logLevelFilter', appender: 'traceFile', level: 'trace' }
  },
  categories: {
    default: { appenders: ['out', 'trace', 'debug', 'info', 'warn', 'error'], level: 'trace' }
  }
})


/**
 * 默认 Logger
 */
export const logger = log4js.getLogger('app')
logger.info('current log level trace')


/**
 * 处理未捕获错误
 */
process.on('unhandledRejection', (reason, p) => {
  logger.error('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})


/**
 * See https://github.com/log4js-node/log4js-node/blob/master/docs/connect-logger.md
 */
export const httpLogger = log4js.connectLogger(
  log4js.getLogger('http'),
  { level: 'auto', format: (req, res, format) => format('Request :status :remote-addr :method :url :referrer') }
)

export default log4js
