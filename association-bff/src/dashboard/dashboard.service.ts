import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  private readonly platformApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.platformApiUrl = this.configService.get('platformApi.baseUrl');
  }

  async getStats() {
    try {
      this.logger.log('Fetching association dashboard statistics');
      
      // Call Platform API to get real stats for the specific association/tenant
      const response = await firstValueFrom(
        this.httpService.get(`${this.platformApiUrl}/api/dashboard/stats`, {
          headers: {
            'Accept': 'application/ld+json',
            // TODO: Add tenant/association context headers
          },
        })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching dashboard stats: ${error.message}`);
      
      // Return mock data for development
      return {
        members: {
          total: 127,
          active: 98,
          new: 12,
        },
        events: {
          total: 24,
          upcoming: 3,
          thisMonth: 5,
        },
        contributions: {
          total: 15680,
          thisMonth: 2340,
          thisYear: 18950,
        },
        memberships: {
          total: 127,
          expiringThisMonth: 8,
        },
      };
    }
  }

  async getRecentActivities() {
    try {
      this.logger.log('Fetching recent association activities');
      
      const response = await firstValueFrom(
        this.httpService.get(`${this.platformApiUrl}/api/dashboard/activities`, {
          headers: {
            'Accept': 'application/ld+json',
            // TODO: Add tenant/association context headers  
          },
        })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching recent activities: ${error.message}`);
      
      // Return mock data for development
      return [
        {
          id: '1',
          title: 'New member registered',
          description: 'Marie Dupont joined as an active member',
          time: '5 minutes ago',
          type: 'member',
          member: 'Marie Dupont',
        },
        {
          id: '2', 
          title: 'Event created',
          description: 'Annual General Meeting scheduled for next month',
          time: '2 hours ago',
          type: 'event',
          member: 'Admin',
        },
        {
          id: '3',
          title: 'Contribution received',
          description: 'Monthly membership fee payment received',
          time: '1 day ago',
          type: 'contribution',
          member: 'Pierre Martin',
        },
        {
          id: '4',
          title: 'Member updated profile',
          description: 'Contact information updated',
          time: '2 days ago',
          type: 'member',
          member: 'Sophie Bernard',
        },
        {
          id: '5',
          title: 'Event registration',
          description: '15 members registered for workshop',
          time: '3 days ago',
          type: 'event',
          member: 'Multiple members',
        },
      ];
    }
  }
}
