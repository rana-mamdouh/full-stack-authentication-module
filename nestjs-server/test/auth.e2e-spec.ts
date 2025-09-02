import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same configuration as main.ts
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/signup (POST)', () => {
    it('should create a new user account', () => {
      const testUser = {
        email: `test${Date.now()}@example.com`,
        name: 'Test User',
        password: 'Password123!',
      };

      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user).toHaveProperty('email', testUser.email);
          expect(res.body.user).toHaveProperty('name', testUser.name);
          expect(res.body.user).not.toHaveProperty('password');
          
          // Store token and user ID for subsequent tests
          authToken = res.body.access_token;
          userId = res.body.user.id;
        });
    });

    it('should return 409 when trying to create user with existing email', () => {
      const testUser = {
        email: `duplicate${Date.now()}@example.com`,
        name: 'Duplicate User',
        password: 'Password123!',
      };

      // First create the user
              return request(app.getHttpServer())
          .post('/api/auth/signup')
          .send(testUser)
          .expect(201)
          .then(() => {
            // Then try to create another user with the same email
            return request(app.getHttpServer())
              .post('/api/auth/signup')
              .send(testUser)
              .expect(409)
              .expect((res) => {
                expect(res.body.message).toBe('User already exists with this email');
              });
          });
    });

    it('should return 400 for invalid email format', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: 'invalid-email',
          name: 'Test User',
          password: 'Password123!',
        })
        .expect(400);
    });

    it('should return 400 for missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: `missing${Date.now()}@example.com`,
          // missing name and password
        })
        .expect(400);
    });

    it('should return 400 for password too short', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: `short${Date.now()}@example.com`,
          name: 'Test User',
          password: '123', // too short
        })
        .expect(400);
    });
  });

  describe('/auth/signin (POST)', () => {
    it('should authenticate existing user and return access token', () => {
      const testUser = {
        email: `signin${Date.now()}@example.com`,
        name: 'Signin User',
        password: 'Password123!',
      };

      // First create the user
              return request(app.getHttpServer())
          .post('/api/auth/signup')
          .send(testUser)
          .expect(201)
          .then(() => {
            // Then sign in
            return request(app.getHttpServer())
              .post('/api/auth/signin')
              .send({
                email: testUser.email,
                password: testUser.password,
              })
              .expect(200)
              .expect((res) => {
                expect(res.body).toHaveProperty('access_token');
                expect(res.body).toHaveProperty('user');
                expect(res.body.user).toHaveProperty('id');
                expect(res.body.user).toHaveProperty('email', testUser.email);
                expect(res.body.user).toHaveProperty('name', testUser.name);
              });
          });
    });

    it('should return 401 for non-existent user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signin')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Invalid credentials');
        });
    });

    it('should return 401 for wrong password', () => {
      const testUser = {
        email: `wrongpass${Date.now()}@example.com`,
        name: 'Wrong Pass User',
        password: 'Password123!',
      };

      // First create the user
              return request(app.getHttpServer())
          .post('/api/auth/signup')
          .send(testUser)
          .expect(201)
          .then(() => {
            // Then try to sign in with wrong password
            return request(app.getHttpServer())
              .post('/api/auth/signin')
              .send({
                email: testUser.email,
                password: 'wrongpassword',
              })
              .expect(401)
              .expect((res) => {
                expect(res.body.message).toBe('Invalid credentials');
              });
          });
    });
  });

  describe('/auth/profile (GET)', () => {
    it('should return user profile when authenticated', () => {
      const testUser = {
        email: `profile${Date.now()}@example.com`,
        name: 'Profile User',
        password: 'Password123!',
      };

      // First create the user and get token
              return request(app.getHttpServer())
          .post('/api/auth/signup')
          .send(testUser)
          .expect(201)
          .then((res) => {
            const token = res.body.access_token;
            
            // Then get profile
            return request(app.getHttpServer())
              .get('/api/auth/profile')
              .set('Authorization', `Bearer ${token}`)
              .expect(200)
              .expect((profileRes) => {
                expect(profileRes.body).toHaveProperty('id');
                expect(profileRes.body).toHaveProperty('email', testUser.email);
                expect(profileRes.body).toHaveProperty('name', testUser.name);
                expect(profileRes.body).not.toHaveProperty('password');
              });
          });
    });

    it('should return 401 when no token provided', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .expect(401);
    });

    it('should return 401 for invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
