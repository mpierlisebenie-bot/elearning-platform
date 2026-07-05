import { SetMetadata } from '@nestjs/common';
import { Role } from '../user/user.entity';

export const ROLES_KEY = 'roles';

/**
 * Décorateur @Roles(...) — restreint une route à certains rôles.
 * Exemple : @Roles(Role.ADMIN, Role.INSTRUCTOR)
 * À combiner avec @UseGuards(AuthGuard('jwt'), RolesGuard)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
