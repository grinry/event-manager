import { Table, Column, Model, BeforeUpdate, BeforeCreate, Length, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from '~app/models/user.model';
import slugify from 'slugify';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'events',
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
  /**
   * Creates static things
   * @param instance gives instance
   */
  static makeLowerCase(instance: Event) {
    if (instance.changed('slug')) {
      instance.slug = slugify(instance.slug.toLowerCase());
    }
  }
}

export default Event;
