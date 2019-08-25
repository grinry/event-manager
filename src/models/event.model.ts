import {
  Table,
  Column,
  Model,
  BeforeUpdate,
  BeforeCreate,
  Length,
  BelongsTo,
  ForeignKey
} from "sequelize-typescript";
import { sequelize } from "~app/connection";
import { User } from "~app/models/user.model";
import slugify from "slugify";

@Table({
  timestamps: true,
  paranoid: true,
  tableName: "events"
})
export class Event extends Model<Event> {

  @Column
  name: string;

  @Length({ min: 6, max: 36 })
  @Column({ unique: true })
  slug: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BeforeUpdate
  @BeforeCreate
  static makeLowerCase(instance: Event) {
    instance.slug = slugify(instance.slug.toLowerCase());
  }
}

sequelize.addModels([Event]);
