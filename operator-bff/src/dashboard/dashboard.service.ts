import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  private readonly operatorApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.operatorApiUrl = this.configService.get('operatorApi.baseUrl');
  }

  async getStats() {
    try {
      this.logger.log('Fetching dashboard statistics');
      
      // Call Operator API to get real stats
      const response = await firstValueFrom(
        this.httpService.get(`${this.operatorApiUrl}/api/dashboard/stats`, {
          headers: {
            'Accept': 'application/ld+json',
            // TODO: Add authentication headers
          },
        })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching dashboard stats: ${error.message}`);
      
      // Return mock data for development
      return {
        associations: 15,
        members: 247,
        events: 8,
        plans: 3,
      };
    }
  }

  async getRecentActivity() {
    try {
      this.logger.log('Fetching recent activity');
      
      const response = await firstValueFrom(
        this.httpService.get(`${this.operatorApiUrl}/api/dashboard/activity`, {
          headers: {
            'Accept': 'application/ld+json',
            // TODO: Add authentication headers  
          },
        })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching recent activity: ${error.message}`);
      
      // Return mock data for development
      return [
        {
          id: '1',
          title: 'New member registered',
          description: 'John Doe joined Association A',
          time: '2 minutes ago',
          type: 'member',
        },
        {
          id: '2', 
          title: 'Event created',
          description: 'Annual meeting scheduled for next month',
          time: '1 hour ago',
          type: 'event',
        },
        {
          id: '3',
          title: 'Association updated',
          description: 'Association B updated their profile',
          time: '3 hours ago',
          type: 'association',
        },
      ];
    }
  }
}
