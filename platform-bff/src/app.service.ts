import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly startTime = Date.now();

  getHealth(): { message: string; timestamp: string; service: string } {
    return {
      message: 'Platform BFF is running!',
      timestamp: new Date().toISOString(),
      service: 'platform-bff',
    };
  }

  getDetailedHealth(): { 
    status: string; 
    timestamp: string; 
    service: string;
    uptime: number;
    version: string;
  } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'platform-bff',
      uptime: Date.now() - this.startTime,
      version: process.env.npm_package_version || '0.0.1',
    };
  }
}
