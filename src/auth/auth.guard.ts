import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRole) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    return requiredRole.includes(request.user.role);
  }
}
