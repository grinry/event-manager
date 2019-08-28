import User from '~app/models/user.model';

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
