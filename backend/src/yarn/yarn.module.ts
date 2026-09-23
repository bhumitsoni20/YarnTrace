import { Module } from '@nestjs/common';
import { YarnService } from './yarn.service';
import { YarnController } from './yarn.controller';

@Module({
  controllers: [YarnController],
  providers: [YarnService],
  exports: [YarnService],
})
export class YarnModule {}
