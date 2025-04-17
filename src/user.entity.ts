// user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    TableInheritance,
    ChildEntity,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum AdminRole {
    CHEF_DE_DEPARTEMENT = 'chef-departement',
    CHEF_DE_SPECIALITE = 'chef-de-specialite',
    DOYEN = 'doyen',
    VICE_DOYEN = 'vice-doyen',
    SECRETAIRE = 'secrétaire',
    AGENT = 'agent',
    ETUDIANT = 'etudiant',
}

@Entity({ name: 'users' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    firstName: string;

    @Column({ length: 100 })
    lastName: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: 'enum',
        enum: AdminRole,
        nullable: true,
    })
    adminRole?: AdminRole;
}