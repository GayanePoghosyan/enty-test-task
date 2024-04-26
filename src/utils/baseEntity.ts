import { BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class ExtendedBaseEntity extends BaseEntity {
    @CreateDateColumn({name: 'createdAt'})
    createdAt: Date;
  
    @UpdateDateColumn({name: 'updatedAt'})
    updatedAt: Date;
}