import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Products } from './products.entity';
import { ProductResolver } from './products.resolver';
import { ProductService } from './products.service';
import { UploadService } from 'src/upload.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { SubCategoriesModule } from 'src/sub-categories/sub-categories.module';
import { LoaderModule } from 'src/loader/loader.module';
import { LocalizedProducts } from './localized.products.entity';
import { LocaziedResolver } from './localized.resolver';
import { SystemLangsModule } from 'src/system-langs/system-langs.module';

@Module({
    imports:[
        SequelizeModule.forFeature([Products,LocalizedProducts]),
        CategoriesModule,
        forwardRef(()=>SubCategoriesModule),
        LoaderModule,
        SystemLangsModule
    ],
    providers:[ProductResolver,LocaziedResolver,ProductService,UploadService],
    exports:[ProductService]
})
export class ProductsModule {}
