import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './module/auth/auth.service';
import { UsersService } from './module/users/users.service';
import { AuthGateway } from './module/common/gateway/AuthGateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private readonly authGateway: AuthGateway,
    private usersService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  getProfile(@Request() req) {
    this.authGateway.joinAuth();
    return this.authService.findOne(req.user.id);
  }

  @Get('statics')
  async getStatics(@Request() req) {
    const users = await this.authService.findAll();
    const { roles } = await this.appService.getStatics();
    return {
      users,
      roles,
    };
  }
}
