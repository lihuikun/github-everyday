import { Test, TestingModule } from '@nestjs/testing';
import { CozeService } from './coze.service';

describe('CozeService', () => {
  let service: CozeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CozeService],
    }).compile();

    service = module.get<CozeService>(CozeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
