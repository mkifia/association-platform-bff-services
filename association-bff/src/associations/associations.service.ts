import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AssociationsService {
  private readonly logger = new Logger(AssociationsService.name);
  private readonly platformApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.platformApiUrl = this.configService.get('platformApi.baseUrl');
  }

  async findAll(page: number, limit: number) {
    try {
      this.logger.log(`Fetching associations - page: ${page}, limit: ${limit}`);
      
      // Call Platform API
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(`${this.platformApiUrl}/`, {
          headers: {
            'Accept': 'application/ld+json',
          },
          params: { page, itemsPerPage: limit }
        })
      );

      return {
        data: response.data['hydra:member'] || [],
        totalItems: response.data['hydra:totalItems'] || 0,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(`Error fetching associations: ${error.message}`);
      
      // Return mock data for development
      return {
        data: [
          {
            id: '1',
            name: 'Association Example 1',
            description: 'Sample association for testing',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2', 
            name: 'Association Example 2',
            description: 'Another sample association',
            createdAt: new Date().toISOString(),
          },
        ],
        totalItems: 2,
        page,
        limit,
      };
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(`Fetching association with id: ${id}`);
      
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(`${this.platformApiUrl}/associations/${id}`, {
          headers: {
            'Accept': 'application/ld+json',
          },
        })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching association ${id}: ${error.message}`);
      
      if (error.response?.status === 404) {
        throw new NotFoundException(`Association with id ${id} not found`);
      }

      // Return mock data for development
      return {
        id,
        name: `Association ${id}`,
        description: `Description for association ${id}`,
        createdAt: new Date().toISOString(),
      };
    }
  }

  async findMembers(associationId: string) {
    try {
      this.logger.log(`Fetching members for association: ${associationId}`);
      
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(`${this.platformApiUrl}/associations/${associationId}/members`, {
          headers: {
            'Accept': 'application/ld+json',
          },
        })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching members for association ${associationId}: ${error.message}`);
      
      // Return mock data for development
      return {
        data: [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            joinedAt: new Date().toISOString(),
          },
        ],
        totalItems: 1,
      };
    }
  }

  async findEvents(associationId: string) {
    try {
      this.logger.log(`Fetching events for association: ${associationId}`);
      
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(`${this.platformApiUrl}/associations/${associationId}/events`, {
          headers: {
            'Accept': 'application/ld+json',
          },
        })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching events for association ${associationId}: ${error.message}`);
      
      // Return mock data for development
      return {
        data: [
          {
            id: '1',
            title: 'Annual Meeting',
            description: 'Annual general meeting',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        totalItems: 1,
      };
    }
  }
}
