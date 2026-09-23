import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { HashUtil } from '../common/utils/hash.util';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mock_token'),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'jwt.accessSecret') return 'test_access_secret';
      if (key === 'jwt.refreshSecret') return 'test_refresh_secret';
      if (key === 'jwt.accessExpiresIn') return '15m';
      if (key === 'jwt.refreshExpiresIn') return '7d';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nonexistent@yarntrace.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should authenticate user and return tokens when credentials match', async () => {
      const hashedPassword = await HashUtil.hash('validPassword123');
      const mockUser = {
        id: 'user-uuid-1',
        email: 'admin@yarntrace.com',
        passwordHash: hashedPassword,
        firstName: 'Marcus',
        lastName: 'Vance',
        status: 'ACTIVE',
        role: {
          id: 'role-uuid-1',
          name: 'Administrator',
          code: 'ADMIN',
          rolePermissions: [],
        },
        userPermissions: [],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'admin@yarntrace.com',
        password: 'validPassword123',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('admin@yarntrace.com');
    });
  });
});
