import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { HashUtil } from '../common/utils/hash.util';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('A user with this email address already exists');
    }

    // Resolve or create role
    const roleCode = dto.roleCode || 'STOCK_HEAD';
    let role = await this.prisma.role.findUnique({
      where: { code: roleCode },
    });

    if (!role) {
      role = await this.prisma.role.create({
        data: {
          name: roleCode.replace('_', ' '),
          code: roleCode,
          description: `Default system role: ${roleCode}`,
        },
      });
    }

    const passwordHash = await HashUtil.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phoneNumber: dto.phoneNumber,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role.code);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: {
          id: user.role.id,
          name: user.role.name,
          code: user.role.code,
        },
        permissions: [],
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
        userPermissions: {
          include: { permission: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active. Please contact administrator.');
    }

    const isMatch = await HashUtil.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role.code);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    const rolePermissions =
      user.role?.rolePermissions.map((rp) => rp.permission.key) || [];
    const directGranted = user.userPermissions
      .filter((up) => up.isGranted)
      .map((up) => up.permission.key);
    const directRevoked = new Set(
      user.userPermissions
        .filter((up) => !up.isGranted)
        .map((up) => up.permission.key),
    );

    const permissions = Array.from(
      new Set([...rolePermissions, ...directGranted]),
    ).filter((k) => !directRevoked.has(k));

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: {
          id: user.role.id,
          name: user.role.name,
          code: user.role.code,
        },
        permissions,
      },
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const refreshSecret =
      this.configService.get<string>('jwt.refreshSecret') ||
      'yarntrace_super_secure_refresh_secret_token_2026_key';

    let payload: { sub: string; email: string; role: string };
    try {
      payload = this.jwtService.verify(dto.refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
        userPermissions: {
          include: { permission: true },
        },
      },
    });

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isTokenMatch = await HashUtil.compare(
      dto.refreshToken,
      user.refreshTokenHash,
    );

    if (!isTokenMatch) {
      throw new UnauthorizedException('Refresh token is invalid or has been rotated');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role.code);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    const rolePermissions =
      user.role?.rolePermissions.map((rp) => rp.permission.key) || [];
    const directGranted = user.userPermissions
      .filter((up) => up.isGranted)
      .map((up) => up.permission.key);
    const directRevoked = new Set(
      user.userPermissions
        .filter((up) => !up.isGranted)
        .map((up) => up.permission.key),
    );

    const permissions = Array.from(
      new Set([...rolePermissions, ...directGranted]),
    ).filter((k) => !directRevoked.has(k));

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: {
          id: user.role.id,
          name: user.role.name,
          code: user.role.code,
        },
        permissions,
      },
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
        userPermissions: {
          include: { permission: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    const rolePermissions =
      user.role?.rolePermissions.map((rp) => rp.permission.key) || [];
    const directGranted = user.userPermissions
      .filter((up) => up.isGranted)
      .map((up) => up.permission.key);
    const directRevoked = new Set(
      user.userPermissions
        .filter((up) => !up.isGranted)
        .map((up) => up.permission.key),
    );

    const permissions = Array.from(
      new Set([...rolePermissions, ...directGranted]),
    ).filter((k) => !directRevoked.has(k));

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: {
        id: user.role.id,
        name: user.role.name,
        code: user.role.code,
      },
      permissions,
    };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessSecret =
      this.configService.get<string>('jwt.accessSecret') ||
      'yarntrace_super_secure_access_secret_token_2026_key';
    const refreshSecret =
      this.configService.get<string>('jwt.refreshSecret') ||
      'yarntrace_super_secure_refresh_secret_token_2026_key';

    const accessExpiresIn =
      this.configService.get<string>('jwt.accessExpiresIn') || '15m';
    const refreshExpiresIn =
      this.configService.get<string>('jwt.refreshExpiresIn') || '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn as JwtSignOptions['expiresIn'],
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn as JwtSignOptions['expiresIn'],
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hashed = await HashUtil.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hashed },
    });
  }
}
