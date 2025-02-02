// src/enrollments/enrollment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Workshop } from '../../workshop/entities/workshop.entity';
import { User } from '../../entities/user.entity';

@Entity('enrollments')
export class Enrollment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string; // e.g., "pending", "confirmed"

    @CreateDateColumn({ name: 'enrolled_at' })
    enrolledAt: Date;

    @ManyToOne(() => Workshop, workshop => workshop.enrollments)
    workshop: Workshop;

    @ManyToOne(() => User, user => user.enrollments)
    learner: User;
}
