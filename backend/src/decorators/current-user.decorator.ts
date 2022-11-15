import { ICurrentUser } from '@interfaces/current-user.interface';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const getCurrentUserByContext = (
  context: ExecutionContext,
): ICurrentUser => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user;
  }
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ICurrentUser =>
    getCurrentUserByContext(context),
);
