import winston from 'winston';

// Load log level from environment (default: info)
const logLevel = process.env.LOG_LEVEL || 'info';

// Define custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    // ✅ Only console logging for cloud (Render)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
  exitOnError: false
});

export default logger;
