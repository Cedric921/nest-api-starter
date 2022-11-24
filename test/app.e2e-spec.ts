import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('--App e2e Test --', () => {
  let app: INestApplication;

  /**
   * Before starting tests, we need some config:
   * - import the appModule
   * - create the app server
   * - add the global pipes
   * - init our server created
   */
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
  });

  it.todo('it pass');

  /**
   * After all tests we need to close, to shutdown our server app
   */
  afterAll(() => {
    app.close();
  });
});
