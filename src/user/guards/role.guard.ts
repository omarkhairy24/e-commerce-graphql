import { Injectable, CanActivate, ExecutionContext, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const role = req.user?.role;
    
    if(!role) throw new NotFoundException('user role not found');
    
    const allowedRole = this.reflector.get(
        'role',
        context.getHandler(),
    );

    if (!allowedRole) return true;

    if (role === 'Admin') return true;
    
    if (allowedRole !== role) {
        throw new NotAcceptableException();
    }

    return true;
  }
}