import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity('workshops')
export class Workshop {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    // This column stores the mentor's user id.
    @Column()
    mentor_id: number;

    @Column({ name: 'location_address' })
    locationAddress: string;

    @Column('decimal')
    locationLat: number;

    @Column('decimal')
    locationLng: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Activity, (activity) => activity.workshop)
    activities: Activity[];
}
