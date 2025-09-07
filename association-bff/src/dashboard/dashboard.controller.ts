import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get association dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Association dashboard statistics' })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('recent-activities')
  @ApiOperation({ summary: 'Get recent association activities' })
  @ApiResponse({ status: 200, description: 'Recent association activities list' })
  async getRecentActivities() {
    return this.dashboardService.getRecentActivities();
  }
}
