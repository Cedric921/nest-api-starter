import { EditUserDto } from './../src/user/dto/edit-user.dto';
import { iAuthDto } from './../src/auth/dto/auth.dto';
import { PrismaService } from './../src/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('APP E2E TEST', () => {
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
    await app.listen(5057);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:5057');
  });

  /**
   * After all tests we need to close, to shutdown our server app
   */
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: iAuthDto = {
      email: 'cedric@test.com',
      password: '123456',
    };

    describe('Sign Up', () => {
      it('Should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('Should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('Should throw if email and password empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({})
          .expectStatus(400);
      });

      it('Should sign up', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Sign In', () => {
      it('Should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('Should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('Should throw if email and password empty', () => {
        return pactum.spec().post('/auth/login').withBody({}).expectStatus(400);
      });

      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('it should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `Bearer $S{userAccessToken}`,
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          email: 'vb@test.com',
          firstname: 'cedric',
          lastname: 'vb',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `Bearer $S{userAccessToken}`,
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstname)
          .expectBodyContains(dto.lastname);
      });
    });
  });

  describe('---Bookmark---', () => {
    describe('Create bookmark', () => {
      it.todo('it pass');
    });

    describe('Get Bookmarks', () => {
      it.todo('it pass');
    });

    describe('Get Bookmarks by Id', () => {
      it.todo('it pass');
    });

    describe('Edit bookmark by id', () => {
      it.todo('it pass');
    });

    describe('Delete bookmark by id', () => {
      it.todo('it pass');
    });
  });
});
