import { SetMetadata } from '@nestjs/common';
export const ROLE = (role: string) => {
	return SetMetadata('role', role);
};