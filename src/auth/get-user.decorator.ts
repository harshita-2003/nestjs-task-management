import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "./user.entity";

//custom decorator to get user from request object
export const GetUser = createParamDecorator((_data, ctx: ExecutionContext) : User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});
