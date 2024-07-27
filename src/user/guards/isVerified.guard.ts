import { Injectable, CanActivate, ExecutionContext, NotAcceptableException, NotFoundException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class isVerifiedGuard implements CanActivate{
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        const isVerified = req.user?.isVerified;

        if(!isVerified) throw new NotFoundException('user are not verified');

        const verified = this.reflector.get('isVerified',context.getHandler())

        if(!verified) return true;

        if(verified === true) return true;

        if(verified !== isVerified) throw new NotAcceptableException('your email is not verified');

        return true
    }
}