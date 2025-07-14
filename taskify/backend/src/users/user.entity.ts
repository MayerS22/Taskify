import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'text', nullable: true })
  profile: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', nullable: true })
  country: string | null;

  @Column({ type: 'varchar', nullable: true })
  resetToken: string | null;

  @Column({ type: 'datetime', nullable: true })
  resetTokenExpiry: Date | null;
} 