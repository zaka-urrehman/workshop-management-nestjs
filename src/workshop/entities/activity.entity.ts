import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { Workshop } from './workshop.entity';
  
  @Entity('activities')
  export class Activity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    workshop_id: number;
  
    @Column()
    title: string;
  
    @Column('text')
    description: string;
  
    @Column({ type: 'timestamp' })
    start_time: Date;
  
    @Column({ type: 'timestamp' })
    end_time: Date;
  
    @Column({ nullable: true })
    google_calendar_event_id: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @ManyToOne(() => Workshop, (workshop) => workshop.activities)
    workshop: Workshop;
  }
  