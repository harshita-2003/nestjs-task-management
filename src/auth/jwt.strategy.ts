import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { JwtPayLoad } from "./jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User) 
        private userRepository : Repository<User>
    ) {
        super({
            secretOrKey : "topsecretkey",
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate (payload : JwtPayLoad) : Promise<User> {
        const { username } = payload;
        const user = await this.userRepository.findOne({ where: { username } });
        if(!user) {
            throw new UnauthorizedException('Invalid token');
        }

        return user;
    }
}