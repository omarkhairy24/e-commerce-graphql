import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Products } from "./products.entity";
import { CategoryService } from "src/categories/categories.service";
import { SubService } from "src/sub-categories/subCategory.service";
import { LocalizedProducts } from "./localized.products.entity";
import { lng } from "src/system-langs/sys.lang.entity";
import { LangService } from "src/system-langs/sys.lang.service";
import { UpdateLocalizationInput, UpdateProductInput } from "./dtos/update.dto";
import { CreateProductInput, LocalizedInput } from "./dtos/create.dto";

@Injectable()
export class ProductService{
    constructor(
        @InjectModel(Products) private repo:typeof Products,
        @InjectModel(LocalizedProducts) private LRepo :typeof LocalizedProducts,
        private categoryService:CategoryService,
        private subService:SubService,
        private langService:LangService
    ){}

    async create(productInput:CreateProductInput,LocalizedInput:LocalizedInput){
        const category = await this.categoryService.findOneById(productInput.categoryId);
        if(!category) throw new NotFoundException('category not found');
        if(productInput.subCategoryId){
            const subCategory = await this.subService.findOneById(productInput.subCategoryId);
            if(!subCategory) throw new NotFoundException('subcategory not found');
            if(subCategory.categoryId !== category.id) throw new BadRequestException('this subcategory is not a child of the main category');
        }

        const product = await this.repo.create({
            price:productInput.price,
            quantity:productInput.quantity,
            images:productInput.images,
            categoryId:productInput.categoryId,
            subCategoryId:productInput.subCategoryId
        });

        await this.LRepo.create({
            lang:LocalizedInput.lang,
            title:LocalizedInput.title,
            description:LocalizedInput.description,
            specification:LocalizedInput.specification,
            productId:product.id
        });

        return product
    }

    async addLocalized(productId:string,input:LocalizedInput){
        const product = await this.repo.findByPk(productId)
        if(!product) throw new NotFoundException('product not found');

        const localized = await this.LRepo.findOne({where:{productId,lang:input.lang}})
        if(localized) throw new BadRequestException('you already have localized this product');

        if(!Object.values(lng).includes(input.lang)){
            throw new BadRequestException(`invalid language name :${input.lang}`)
        }

        return this.LRepo.create({
            productId,
            lang:input.lang,
            title:input.title,
            description:input.description,
            specification:input.specification
        })
    }
    
    async updateProduct(
        productId:string,
        localizedId:string,
        productInput:UpdateProductInput,
        localizedInput:UpdateLocalizationInput
    ){
        const product = await this.findOneById(productId);
        if(!product) throw new NotFoundException();

        if(productInput.categoryId){
            const category = await this.categoryService.findOneById(productInput.categoryId);
            if(!category) throw new NotFoundException('category not found');
        }
        if(productInput.subCategoryId){
            const subCategory = await this.subService.findOneById(productInput.subCategoryId);
            if(!subCategory) throw new NotFoundException('subcategory not found');
        }

        Object.assign(product,productInput);
        
        await product.save();

        if(localizedInput){
            const localizedData = await this.LRepo.findOne({
                where:{id:localizedId,productId}
            })

            Object.assign(localizedData,localizedInput)

            await localizedData.save();
        }

        return product;

       
    }

    async remove(id:string){
        const product = await this.repo.findByPk(id)
        if(!product) throw new NotFoundException();

        return product.destroy();
    }

    findOneById(id:string){
        return this.repo.findByPk(id)
    }

    findAll(){
        return this.repo.findAll()
    }

    findByIds(ids:string[]){
        return this.repo.findAll({where:{id:ids}});
    }

    findBySubIds(subIds:string[]){
        return this.repo.findAll({where:{subCategoryId:subIds}});
    }

    findByCategoryIds(catId:string[]){
        return this.repo.findAll({where:{categoryId:catId}});
    }

    getLocalized(productIds:string[]){
        return this.LRepo.findAll({where:{productId:productIds}})
    }

    async findByLang(lang:lng){
        if(!Object.values(lng).includes(lang)){
            const defLang = await this.langService.findDefault();
            return this.repo.findAll({
                include: [
                    {
                        model: LocalizedProducts,
                        where: { lang:defLang },
                    },
                ],
            });
        }
        
        const products = await this.repo.findAll({
            include: [
                {
                    model: LocalizedProducts,
                    where: { lang },
                },
            ],
        });
        
        return products
    }

    async findOneByLang(id:string,lang:lng){
        const product = this.repo.findOne({
            where:{id},
            include: [
                {
                    model: LocalizedProducts,
                    where: { lang },
                },
            ],
        });

        return product
    }

}