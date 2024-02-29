import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  index!: string;

  @Column()
  contract_address!: string;

  @Column({ type: 'float', nullable: true })
  current_price?: number;
}
