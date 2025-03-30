import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity'; // Import User from user-service

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  filePath: string;

  @ManyToOne(() => User, user => user.id)
  uploadedBy: User;

  @Column({ nullable: true })
  ingestionStatus: string; // pending, processing, completed, failed

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}