import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { UserService } from './user.service';
import { AuthResolver } from './auth.resolver';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/auth.guards';
import { UserResolver } from './user.resolver';
import { UploadService } from 'src/upload.service';

@Module({
    imports:[
        SequelizeModule.forFeature([User]),
        JwtModule.register({
            global:true,
            secret:'jwtsecret',
            signOptions:{expiresIn :'90d'}
        }),
        MailModule,
    ],
    providers:[AuthResolver,UserResolver,UserService,JwtStrategy,UploadService],
    exports:[JwtStrategy,JwtModule,UserService]
})
export class UserModule {}
