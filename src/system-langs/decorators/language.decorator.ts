import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Lang = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlContext = ctx.getArgs[2]?.req;
    return gqlContext?.headers['accept-language'];
  },
);
