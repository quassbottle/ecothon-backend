import { Test, TestingModule } from '@nestjs/testing';
import { EmailNotifierController } from './email-notifier.controller';
import { EmailNotifierService } from './email-notifier.service';

describe('EmailNotifierController', () => {
  let emailNotifierController: EmailNotifierController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmailNotifierController],
      providers: [EmailNotifierService],
    }).compile();

    emailNotifierController = app.get<EmailNotifierController>(EmailNotifierController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(emailNotifierController.getHello()).toBe('Hello World!');
    });
  });
});
