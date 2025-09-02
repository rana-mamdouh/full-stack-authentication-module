import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
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

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api', () => {
    it('should return server status information', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'running');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
          expect(res.body).toHaveProperty('environment');
          expect(res.body).toHaveProperty('version');
          expect(res.body).toHaveProperty('memory');
          expect(res.body).toHaveProperty('platform');
          expect(res.body).toHaveProperty('nodeVersion');
          
          // Validate timestamp format
          expect(new Date(res.body.timestamp).getTime()).toBeGreaterThan(0);
          
          // Validate uptime is a number
          expect(typeof res.body.uptime).toBe('number');
          expect(res.body.uptime).toBeGreaterThan(0);
          
          // Validate memory object structure
          expect(res.body.memory).toHaveProperty('used');
          expect(res.body.memory).toHaveProperty('total');
          expect(res.body.memory).toHaveProperty('external');
          expect(typeof res.body.memory.used).toBe('number');
          expect(typeof res.body.memory.total).toBe('number');
          expect(typeof res.body.memory.external).toBe('number');
          
          // Validate environment
          expect(['development', 'production', 'test']).toContain(res.body.environment);
          
          // Validate platform
          expect(['win32', 'darwin', 'linux']).toContain(res.body.platform);
          
          // Validate Node.js version format
          expect(res.body.nodeVersion).toMatch(/^v\d+\.\d+\.\d+$/);
        });
    });

    it('should return consistent status across multiple requests', async () => {
      const firstResponse = await request(app.getHttpServer()).get('/api');
      const secondResponse = await request(app.getHttpServer()).get('/api');
      
      expect(firstResponse.status).toBe(200);
      expect(secondResponse.status).toBe(200);
      
      // Status should remain consistent
      expect(firstResponse.body.status).toBe(secondResponse.body.status);
      expect(firstResponse.body.environment).toBe(secondResponse.body.environment);
      expect(firstResponse.body.platform).toBe(secondResponse.body.platform);
      expect(firstResponse.body.nodeVersion).toBe(secondResponse.body.nodeVersion);
      
      // Timestamps should be different
      expect(firstResponse.body.timestamp).not.toBe(secondResponse.body.timestamp);
      
      // Uptime should increase or stay the same
      expect(secondResponse.body.uptime).toBeGreaterThanOrEqual(firstResponse.body.uptime);
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'healthy');
          expect(res.body).toHaveProperty('timestamp');
          
          // Validate timestamp format
          expect(new Date(res.body.timestamp).getTime()).toBeGreaterThan(0);
        });
    });

    it('should return consistent health status', async () => {
      const firstResponse = await request(app.getHttpServer()).get('/api/health');
      const secondResponse = await request(app.getHttpServer()).get('/api/health');
      
      expect(firstResponse.status).toBe(200);
      expect(secondResponse.status).toBe(200);
      
      // Status should remain consistent
      expect(firstResponse.body.status).toBe(secondResponse.body.status);
      
      // Timestamps should be different
      expect(firstResponse.body.timestamp).not.toBe(secondResponse.body.timestamp);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', () => {
      return request(app.getHttpServer())
        .get('/api/non-existent-route')
        .expect(404);
    });

    it('should handle malformed requests gracefully', () => {
      return request(app.getHttpServer())
        .post('/api')
        .send({ invalid: 'data' })
        .expect(404); // POST not allowed on GET endpoint
    });
  });

  describe('Response Headers', () => {
    it('should return proper content-type headers', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should return proper content-type headers for health endpoint', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('Performance', () => {
    it('should respond quickly to status requests', async () => {
      const startTime = Date.now();
      
      await request(app.getHttpServer())
        .get('/api')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    it('should respond quickly to health requests', async () => {
      const startTime = Date.now();
      
      await request(app.getHttpServer())
        .get('/api/health')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });
  });
});
