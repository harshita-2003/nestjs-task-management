import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authservice : AuthService) {}

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto) : Promise<User> {
        return this.authservice.createUser(authCredentialsDto);
    }

    @Post('/signin')
    signIn(@Body() authCredentialsDto: AuthCredentialsDto) : Promise<{accessToken : string}> {
        return this.authservice.signIn(authCredentialsDto);
    }

    //Protecting route
    //if token is valid then only we can access this route
    @Post('/test')
    @UseGuards(AuthGuard())
    //@UseGuards(AuthGuard('jwt'))    -> same jwt is default strategy
    test(@Req() req) {
        console.log(req);
    }

}