import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ActivityEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  contract_address!: string;

  @Column()
  token_index!: string;

  @Column({ type: 'float' })
  listing_price!: number;

  @Column()
  maker!: string;

  @Column({ nullable: true })
  listing_from?: number;

  @Column({ nullable: true })
  listing_to?: number;

  @Column()
  event_timestamp!: Date;
}
