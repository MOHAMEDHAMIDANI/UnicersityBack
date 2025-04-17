import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtudiantModule } from './etudiant/etudiant.module';
import { EnseignantModule } from './enseignant/enseignant.module';
import { AdministrateurModule } from './administrateur/administrateur.module';
import { DepartmentsModule } from './departments/departments.module';
import { ModulesModule } from './modules/modules.module';
import { NotesModule } from './notes/notes.module';
import { SchedulesModule } from './schedules/schedules.module';
import { SectionModule } from './section/section.module';
import { SectionController } from './section/section.controller';
import { Administrateur } from './administrateur/administrateur.entity';
import { Department } from './departments/departments.entity';
import { Enseignant } from './enseignant/enseignant.entity';
import { Etudiant } from './etudiant/etudiant.entity';
import { StudyModule } from './modules/modules.entity';
import { Note } from './notes/notes.entity';
import { Schedule } from './schedules/schedules.entity';
import { Section } from './section/section.entity';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  TypeOrmModule.forRoot({}),
  TypeOrmModule.forFeature([
    Administrateur,
    Department,
    Enseignant,
    Etudiant,
    StudyModule,
    Note,
    Schedule,
    Section,
    User
  ]),
    EtudiantModule,
    EnseignantModule,
    AdministrateurModule,
    DepartmentsModule,
    ModulesModule,
    NotesModule,
    SchedulesModule,
    SectionModule,
  ],
  controllers: [SectionController],
})
export class AppModule { }