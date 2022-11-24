import { PrismaService } from './../src/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('--App e2e Test --', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  /**
   * Before starting tests, we need some config:
   * - import the appModule
   * - create the app server
   * - add the global pipes
   * - init our server created
   */
  beforeAll(async () => {
    /** import of App module */
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    /** create app  */
    app = moduleRef.createNestApplication();

    /** add the global pipe */
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    /** Initialisation of the app */
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  it.todo('it pass');

  /**
   * After all tests we need to close, to shutdown our server app
   */
  afterAll(() => {
    app.close();
  });

  describe('-Auth- ', () => {
    describe('Sign Up', () => {
      ('');
    });

    describe('Sign In', () => {
      ('');
    });
  });

  describe('-User-', () => {
    describe('Get me', () => {
      ('');
    });

    describe('Edit user', () => {
      ('');
    });
  });

  describe('-Bookmark-', () => {
    describe('Create bookmark', () => {
      ('');
    });

    describe('Get Bookmarks', () => {
      ('');
    });

    describe('Get Bookmarks by Id', () => {
      ('');
    });

    describe('Edit bookmark', () => {
      ('');
    });

    describe('Delete bookmark', () => {
      ('');
    });
  });
});
