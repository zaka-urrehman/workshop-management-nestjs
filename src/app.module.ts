import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { MentorModule } from './mentor/mentor.module';
import { LearnerModule } from './learner/learner.module';


@Module({
  imports: [AdminModule, MentorModule, LearnerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
