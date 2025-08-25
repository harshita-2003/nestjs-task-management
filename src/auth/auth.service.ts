import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userInformation : Repository<User>,
        private jwtService : JwtService
    ) {}

    //signUp user
    async createUser(authcredentialdto : AuthCredentialsDto) : Promise<User> {
        const {username , password} = authcredentialdto

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userInformation.create({ username, password: hashedPassword });
        try {
            await this.userInformation.save(user);
            return user;
        } catch (error) {
            if(error.code === '23505') {
                throw new ConflictException('Username already exists');
            }else {
                throw new InternalServerErrorException()
            }
        }
    }

    //signIn user
    async signIn(authcredentialdto : AuthCredentialsDto) : Promise<{accessToken : string}> {
        const {username, password} = authcredentialdto;

        const user = await this.userInformation.findOne({
            where: { username },
            select: ['id', 'username', 'password'], 
        })
        if (user && await bcrypt.compare(password, user.password)) {
            const payload : JwtPayLoad = { username }
            const accessToken = await this.jwtService.sign(payload)
            return { accessToken };
        }else {
            throw new UnauthorizedException('Invalid credentials');
        }

    }
}
