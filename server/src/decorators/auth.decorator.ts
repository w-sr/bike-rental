import { ApolloError } from "apollo-server-errors";
import { UserRole } from "../constants/common.constants";
import { ErrorConstants } from "../constants/errors.constants";

/**
 * Middleware to check manager role
 * if user, throw permission error
 */
export function VerifyManager(
  _target: any,
  _propertyKey: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<void>>
) {
  const fn = descriptor.value!;
  descriptor.value = function DescriptorValue(...args: any[]) {
    try {
      if (args[1].user.role !== UserRole.Manager) {
        throw new ApolloError(ErrorConstants.PERMISSION_DENIED);
      }
      return fn.apply(this, args);
    } catch (error) {
      throw new ApolloError(error as string);
    }
  };
  return descriptor;
}

/**
 * Middleware to check user role
 * if manager, throw permission error
 */
export function VerifyUser(
  _target: any,
  _propertyKey: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<void>>
) {
  const fn = descriptor.value!;
  descriptor.value = function DescriptorValue(...args: any[]) {
    try {
      if (args[1].user.role !== UserRole.User) {
        throw new ApolloError(ErrorConstants.PERMISSION_DENIED);
      }
      return fn.apply(this, args);
    } catch (error) {
      throw new ApolloError(error as string);
    }
  };
  return descriptor;
}
