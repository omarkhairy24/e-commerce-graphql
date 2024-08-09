import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubCategories } from './subCategory.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { SubService } from './subCategory.service';
import { SubResolver } from './subCategory.resolver';
import { ProductsModule } from 'src/products/products.module';
import { LoaderModule } from 'src/loader/loader.module';

@Module({
    imports:[
        SequelizeModule.forFeature([SubCategories]),
        forwardRef(() => CategoriesModule),
		forwardRef(() => LoaderModule),
    ],
    providers:[SubService,SubResolver],
    exports:[SubService]
})
export class SubCategoriesModule {}
