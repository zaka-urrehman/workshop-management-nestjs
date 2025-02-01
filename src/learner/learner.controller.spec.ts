import { Test, TestingModule } from '@nestjs/testing';
import { LearnerController } from './learner.controller';
import { LearnerService } from './learner.service';

describe('LearnerController', () => {
  let controller: LearnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearnerController],
      providers: [LearnerService],
    }).compile();

    controller = module.get<LearnerController>(LearnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
