import { expect } from 'chai';
import { clearDatabase, openDatabase } from '../../_db';
import { createAccount } from '../../../src/services/auth.service';
import User from '../../../src/models/user.model';

describe('Authentication service', () => {
  beforeEach(async () => {
    await openDatabase();
  });
  afterEach(async () => {
    await clearDatabase();
  });

  it('should create an account of organizer', async () => {
    const user = await createAccount('test@test.com', 'secret', 'name');
    expect(user.id).to.be.equal(1);
    expect(user.email).to.be.equal('test@test.com');
    expect(user.name).to.be.equal('name');
    expect(await User.count()).to.be.equal(1);
  });
});
