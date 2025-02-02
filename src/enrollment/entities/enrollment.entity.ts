import { User } from 'src/entities/user.entity';
import { Workshop } from 'src/workshop/entities/workshop.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

export enum EnrollmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  // Add additional statuses if needed
}

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.PENDING,
  })
  status: EnrollmentStatus;

  @CreateDateColumn({ name: 'enrolled_at' })
  enrolledAt: Date;

  @ManyToOne(() => Workshop, workshop => workshop.enrollments)
  workshop: Workshop;

  @ManyToOne(() => User, user => user.enrollments)
  learner: User;
}
