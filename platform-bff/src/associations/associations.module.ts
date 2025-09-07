import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AssociationsController } from './associations.controller';
import { AssociationsService } from './associations.service';

@Module({
  imports: [HttpModule],
  controllers: [AssociationsController],
  providers: [AssociationsService],
})
export class AssociationsModule {}
