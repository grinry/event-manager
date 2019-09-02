import { expect, use } from 'chai';
import { authorizeUser, createAccount } from '../../../src/services/auth.service';
import User from '../../../src/models/user.model';
import { clearDatabase, openDatabase } from '../../_db';
import { decode } from 'jsonwebtoken';
import { HttpStatusError } from '../../../src/utils/APIError';
import * as httpStatus from 'http-status';
import chaiAsPromised from 'chai-as-promised';

// @ts-ignore
use(chaiAsPromised);

const user1Data = {
  email: 'rytis.grincevicius@gmail.com',
  password: 'secret',
  name: 'Rytis',
  companyName: 'Grinry',
  companyAddress: 'Vilnius, Lithuania',
};

const user2Data = {
  email: 'rytis.grincevicius@gmail.com',
  password: '123secret',
  name: 'Rytis',
  companyName: 'Grinry',
  companyAddress: 'Vilnius, Lithuania',
};

const newPassword = 'thisIsNewPassword';

describe('Authentication service', function() {
  before(async function() {
    await openDatabase();
  });
  // beforeEach(async function() {
  //   await createAccount(user1Data.email, user1Data.password, user1Data.name);
  //   console.log('before each');
  // });
  // afterEach(async function() {
  //   await User.truncate();
  //   console.log('after each');
  // });
  after(async function() {
    await clearDatabase();
  });
  it('should create an account of event organizer', async function() {
    const user = await createAccount(user1Data.email, user1Data.password, user1Data.name);
    expect(user.id).to.be.equal(1);
    expect(user.email).to.be.equal(user1Data.email);
    expect(user.name).to.be.equal(user1Data.name);
    expect(await User.count()).to.be.equal(1, 'User count is two.');
  });

  it('authenticate using email and password', async function() {
    const accessToken = await authorizeUser(user1Data.email, user1Data.password, 'name');
    const decoded: any = await decode(accessToken);
    expect(decoded.sub).to.be.equal(1);
    expect(decoded.email).to.be.equal(user1Data.email);
    expect(decoded.scope[0]).to.be.equal('name');
  });

  it('throw error when trying to authenticate using non-existing email', function(done) {
    expect(authorizeUser('no-email@gmail.com', user1Data.password, 'name'))
      .to.be.rejectedWith(HttpStatusError, httpStatus[httpStatus.UNAUTHORIZED])
      .and.notify(done);
  });

  it('throw error when trying to authenticate using incorrect password', function(done) {
    expect(authorizeUser(user1Data.email, 'badPassword', 'name'))
      .to.be.rejectedWith(HttpStatusError, httpStatus[httpStatus.UNAUTHORIZED])
      .and.notify(done);
  });

  it('change password and test connection', async function() {
    const user = await User.findByPk(1);
    user.password = newPassword;
    await user.save();
    expect(await user.isPasswordMatches(newPassword)).to.be.equal(true);
  });
});
