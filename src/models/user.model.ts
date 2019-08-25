import { Table, Column, Model, HasMany } from "sequelize-typescript";
import { sequelize } from "~app/connection";

@Table({
  timestamps: true,
  tableName: "users"
})
export class User extends Model<User> {
  @Column
  name: string;

  @Column
  birthday: Date;

  @Column
  password: string;

  @Column({ unique: true })
  email: string;

  // @HasMany(() => Hobby)
  // hobbies: Hobby[];
}

sequelize.addModels([User]);
