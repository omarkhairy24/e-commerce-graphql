import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailModule } from './mail/mail.module';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';
import { LoaderModule } from './loader/loader.module';
import { SystemLangsModule } from './system-langs/system-langs.module';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:`.env`
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver:ApolloDriver,
      path:'/graphql',
      autoSchemaFile:join(process.cwd(),'src/schema.gql'),
      context:({req,res}) =>({
        req,
        res
      })
    }),
    // SequelizeModule.forRoot({
    //   dialect:'sqlite',
    //   storage:'db.sqlite',
    //   synchronize:true,
    //   autoLoadModels:true
    // }),
    SequelizeModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>{
        return{
          dialect:config.get<string>('DB_TYPE') as Dialect,
          host: config.get<string>('host'),
          port: config.get<number>('port'),
          username:config.get<string>('username') ,
          password: config.get<string>('password'),
          storage:config.get<string>('DB_NAME'),
          autoLoadModels:true,
          database:config.get<string>('DB_NAME'),
          synchronize:false
        }
      }
    }),
    UserModule,
    ProductsModule,
    LoaderModule,
    CategoriesModule,
    SubCategoriesModule,
    MailModule,
    SystemLangsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))
      .forRoutes('graphql');
  }
}