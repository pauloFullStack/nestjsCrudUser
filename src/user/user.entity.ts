import {
  Entity,
  ObjectIdColumn,
  Column,
  ObjectId,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class Users {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 1 })
  role: number;

  @Column()
  iv: string;

  @Column({ nullable: true })
  telephone: string;

  @Column()
  profilePhoto: string;

  @Column({ type: 'timestamp' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted: Date;

  @BeforeInsert()
  setCreatedDate() {
    this.created = new Date();
  }

  @BeforeUpdate()
  setUpdatedDate() {
    this.updated = new Date();
  }
}
