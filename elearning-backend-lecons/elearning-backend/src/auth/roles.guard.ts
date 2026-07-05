import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '../user/user.entity';

/**
 * RolesGuard — Autorisation basée sur les rôles (RBAC).
 *
 * Lit les rôles exigés par le décorateur @Roles() (sur la méthode ou la classe)
 * et les compare au rôle contenu dans le JWT (injecté dans request.user
 * par la JwtStrategy). Sans @Roles(), la route reste accessible à tout
 * utilisateur authentifié.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Pas de rôles exigés → JWT seul suffit
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user?.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Accès réservé aux rôles : ${requiredRoles.join(', ')}`,
      );
    }
    return true;
  }
}
