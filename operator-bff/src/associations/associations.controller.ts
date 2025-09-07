import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AssociationsService } from './associations.service';

@ApiTags('Associations')
@Controller('associations')
export class AssociationsController {
  constructor(private readonly associationsService: AssociationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all associations' })
  @ApiResponse({ status: 200, description: 'List of associations' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.associationsService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get association by id' })
  @ApiResponse({ status: 200, description: 'Association details' })
  @ApiResponse({ status: 404, description: 'Association not found' })
  @ApiParam({ name: 'id', description: 'Association ID' })
  async findOne(@Param('id') id: string) {
    return this.associationsService.findOne(id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get association members' })
  @ApiResponse({ status: 200, description: 'List of association members' })
  @ApiParam({ name: 'id', description: 'Association ID' })
  async findMembers(@Param('id') id: string) {
    return this.associationsService.findMembers(id);
  }

  @Get(':id/events')
  @ApiOperation({ summary: 'Get association events' })
  @ApiResponse({ status: 200, description: 'List of association events' })
  @ApiParam({ name: 'id', description: 'Association ID' })
  async findEvents(@Param('id') id: string) {
    return this.associationsService.findEvents(id);
  }
}
