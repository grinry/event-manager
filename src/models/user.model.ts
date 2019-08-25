import { Table, Column, Model, IsEmail, BeforeUpdate, BeforeCreate, Length, HasMany } from "sequelize-typescript";
import { sequelize } from "~app/connection";
import { Event } from "~app/models/event.model";

@Table({
  timestamps: true,
  paranoid: true,
  tableName: "users"
})
export class User extends Model<User> {

  @IsEmail
  @Column({ unique: true })
  email: string;

  @Length({ min: 6, max: 36 })
  @Column
  password: string;

  @Column
  name: string;

  @HasMany(() => Event, 'userId')
  events: Event[];

  @BeforeUpdate
  @BeforeCreate
  static makeLowerCase(instance: User) {
    instance.email = instance.email.toLowerCase();
  }
  // @HasMany(() => Hobby)
  // hobbies: Hobby[];
}

sequelize.addModels([User]);
