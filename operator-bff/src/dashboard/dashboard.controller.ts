import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics' })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get recent activity' })
  @ApiResponse({ status: 200, description: 'Recent activity list' })
  async getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }
}
