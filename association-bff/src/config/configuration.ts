export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API Configuration
  apiUrl: process.env.PLATFORM_API_URL || 'http://localhost:8000/api',
  operatorApiUrl: process.env.OPERATOR_API_URL || 'http://localhost:8001/api',
  
  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || '',
  },
  
  // CORS Configuration
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'development-secret-key',
    expiresIn: '24h',
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
});
