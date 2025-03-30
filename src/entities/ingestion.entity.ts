import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class IngestionStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  documentId: number; // Reference to document ID

  @Column()
  status: string; // pending, processing, completed, failed

  @Column({ nullable: true })
  message: string; // Optional message (e.g., error details)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}