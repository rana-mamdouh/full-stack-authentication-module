import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthResponse = {
    access_token: 'jwt-token-123',
    user: {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
    },
  };

  const mockProfileResponse = {
    id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
            getProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('signup', () => {
    it('should create a new user account', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      authService.signup.mockResolvedValue(mockAuthResponse);

      const result = await controller.signup(signupDto);

      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('signin', () => {
    it('should authenticate existing user', async () => {
      const signinDto: SigninDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      authService.signin.mockResolvedValue(mockAuthResponse);

      const result = await controller.signin(signinDto);

      expect(authService.signin).toHaveBeenCalledWith(signinDto);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockRequest = {
        user: {
          _id: 'user123',
        },
      };

      authService.getProfile.mockResolvedValue(mockProfileResponse);

      const result = await controller.getProfile(mockRequest);

      expect(authService.getProfile).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockProfileResponse);
    });
  });
});
