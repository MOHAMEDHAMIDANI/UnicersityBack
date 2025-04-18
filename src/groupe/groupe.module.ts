// src/groupe/groupe.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupeController } from './groupe.controller';
import { GroupeService } from './groupe.service';
import { Groupe } from './groupe.entity';
import { Section } from '../section/section.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Groupe, Section]),
        AuthModule , JwtModule
    ],
    controllers: [GroupeController],
    providers: [GroupeService],
    exports: [GroupeService]
})
export class GroupeModule { }