'use strict'

var log4js = require('log4js')
var logger = log4js.getLogger()
var expressLogger = log4js.getLogger('expressLogger')

log4js.configure({
    appenders: {
    file: { type: 'file', filename: 'logs/logs.log', maxLogSize: 1000000, backups: 4, compress: false },
        console: { type: 'console' },
        expressLogger: { type: 'file', filename: 'logs/express.log', maxLogSize: 500000, backups: 10, compress: false }
    },
    categories: {
        default: { appenders: ['file', 'console'], level: 'debug' },
        expressLogger: { appenders: ['expressLogger'], level: 'debug' }
    }
})

function info (message) {
    logger.info(message)
}

function warning (message) {
    logger.warn(message)
}

function error (message) {
    logger.error(message)
}

function connectLogger () {
    return log4js.connectLogger(expressLogger, { level: 'auto' })
}

module.exports = {
    info: info,
    warning: warning,
    error: error,
    connectLogger: connectLogger
}