# Configuration

- yarn add @nestjs/config
- app.module & auth.module -> whereever required env var make function async import configModule, use configService.get(var_name)

# Config Schema Validation
yarn add @hapi/joi
yarn add -D @types/hapi__joi



# JWT 
- import necessary - passport passport-jwt 
- register both - PassportModule.register({ defaultStrategy: 'jwt' }),
                JwtModule.registerAsync

- jwt accesstoken generate : this.jwtService.sign(payload)
- make a jwt strategy 
- use like this for route or controller : @UseGuards(AuthGuard())