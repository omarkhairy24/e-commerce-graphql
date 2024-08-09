import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Categories } from './categories.entity';
import { CategoryService } from './categories.service';
import { ProductsModule } from 'src/products/products.module';
import { CategoryResolver } from './categories.resolver';
import { SubCategoriesModule } from 'src/sub-categories/sub-categories.module';
import { LoaderModule } from 'src/loader/loader.module';

@Module({
    imports:[
        SequelizeModule.forFeature([Categories]),
        forwardRef(() => ProductsModule),
		LoaderModule,
    ],
    providers:[CategoryService,CategoryResolver],
    exports:[CategoryService]
})
export class CategoriesModule {}
