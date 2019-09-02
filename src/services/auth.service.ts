import User from '~app/models/user.model';
import * as httpStatus from 'http-status';
import { HttpStatusError } from '~app/utils/APIError';

/**
 * Create an account with given parameters.
 * @param email
 * @param password
 * @param name
 * @return Bluebird<User>
 */
export async function createAccount(email: string, password: string, name: string) {
  return await User.create({
    email,
    name,
    password,
  });
}

/**
 * Authorize user with given email and password, returns access token.
 * @param email
 * @param password
 * @param scope
 */
export async function authorizeUser(email: string, password: string, scope: string | string[] = ['*']) {
  const user = await User.findOne({ where: { email } });
  if (!user || (user && !(await user.isPasswordMatches(password)))) {
    throw new HttpStatusError(httpStatus.UNAUTHORIZED);
  }
  return await user.getAccessToken(scope);
}
