import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Language } from './sys.lang.entity';
import { LangService } from './sys.lang.service';
import { LangResolver } from './sys.lang.resolver';

@Module({
    imports:[
        SequelizeModule.forFeature([Language])
    ],
    providers:[LangResolver,LangService],
    exports:[LangService]
})
export class SystemLangsModule {}
