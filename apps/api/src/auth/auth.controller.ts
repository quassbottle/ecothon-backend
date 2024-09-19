import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginDTO } from './dto/login.dto';
import { UserRegisterDTO } from './dto/register.dto';
import { TokenDTO } from './dto/token.dto';
import { Serialize } from '@app/common';
import { UserAddTestDto } from "./dto/user-add-test.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: TokenDTO })
  @Serialize(TokenDTO)
  @Post('login')
  async login(@Body() data: UserLoginDTO) {
    return this.authService.login({ data });
  }

  @Post('add_user_test')
  async addUser(@Body() dto: UserAddTestDto) {
    return this.authService.register({
      data: {
        email: dto.email,
        password: '1',
        firstName: '1',
        lastName: '1',
        middleName: '1',
        tags: [],
      } as UserRegisterDTO,
    });
  }

  @ApiOkResponse({ type: TokenDTO })
  @Serialize(TokenDTO)
  @Post('register')
  async register(@Body() data: UserRegisterDTO) {
    return this.authService.register({ data });
  }
}
