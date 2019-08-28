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
} from 'sequelize-typescript';
import { Event } from '~app/models/event.model';
import { hash } from 'bcryptjs';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'users',
})
export class User extends Model<User> {
  @IsEmail
  @Length({ max: 60 })
  @Column({ unique: true })
  email: string;

  @Length({ min: 6, max: 36 })
  @Column
  password: string;

  @Length({ max: 60 })
  @Column
  name: string;

  @Length({ max: 60 })
  @Column({ allowNull: true })
  companyName: string;

  @Length({ max: 100 })
  @Column({ allowNull: true })
  companyAddress: string;

  @HasMany(() => Event, 'userId')
  events: Event[];

  // @ForeignKey(() => User)
  // @Column({ allowNull: true, defaultValue: null, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  // referrerId: string;

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
