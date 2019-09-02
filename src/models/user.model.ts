import {
  Table,
  Column,
  Model,
  IsEmail,
  BeforeUpdate,
  BeforeCreate,
  Length,
  HasMany,
  ForeignKey,
  Sequelize,
} from 'sequelize-typescript';
import { Event } from '~app/models/event.model';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { config } from '~config';
import moment = require('moment');
import { STRING } from 'sequelize';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'users',
})
export class User extends Model<User> {
  @IsEmail
  @Length({ max: 60 })
  @Column({ unique: true, type: STRING(60) })
  email: string;

  @Column
  password: string;

  @Length({ max: 60 })
  @Column({ type: STRING(60) })
  name: string;

  @Length({ max: 60 })
  @Column({ allowNull: true, type: STRING(60) })
  companyName: string;

  @Length({ max: 200 })
  @Column({ allowNull: true, type: STRING(200) })
  companyAddress: string;

  @HasMany(() => Event, 'userId')
  events: Event[];

  // @ForeignKey(() => User)
  // @Column({ allowNull: true, defaultValue: null, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  // referrerId: string;

  /**
   * @param password
   */
  async isPasswordMatches(password: string): Promise<boolean> {
    return compare(password, this.password);
  }

  /**
   *
   * @param scope
   * @param expireAfterMinutes
   * @return string
   */
  async getAccessToken(scope: string | string[] = ['*'], expireAfterMinutes?: number): Promise<string> {
    const payload = {
      sub: this.id,
      email: this.email,
      scope: Array.isArray(scope) ? scope : [scope],
      exp: moment()
        .add(expireAfterMinutes || config.jwt.expireAfterMinutes, 'minutes')
        .unix(),
      iat: moment().unix(),
    };
    return await sign(payload, config.jwt.secret);
  }

  @BeforeUpdate
  @BeforeCreate
  static makeLowerCase(user: User) {
    if (user.changed('email')) {
      user.email = user.email.toLowerCase();
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async updatePassword(user: User) {
    if (user.changed('password')) {
      user.password = await hash(user.password, 10);
    }
  }

  // @HasMany(() => Hobby)
  // hobbies: Hobby[];
}

export default User;
