import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Products } from "./products.entity";
import { CategoryService } from "src/categories/categories.service";
import { SubService } from "src/sub-categories/subCategory.service";
import { LocalizedProducts } from "./localized.products.entity";
import { lng } from "src/system-langs/sys.lang.entity";
import { LangService } from "src/system-langs/sys.lang.service";

@Injectable()
export class ProductService{
    constructor(
        @InjectModel(Products) private repo:typeof Products,
        @InjectModel(LocalizedProducts) private LRepo :typeof LocalizedProducts,
        private categoryService:CategoryService,
        private subService:SubService,
        private langService:LangService
    ){}

    async create(lang:lng,title:string,description:string,specification:string,price:number,quantity:number,images:string[],categoryId:string,subCategoryId:string){
        
        if (categoryId && subCategoryId) throw new BadRequestException('You should provide only one of categoryId or subcategoryId');
        if (!categoryId && !subCategoryId) throw new BadRequestException('You should provide either categoryId or subcategoryId');

        if(categoryId){
            const category = await this.categoryService.findOneById(categoryId);
            if(!category) throw new NotFoundException('category not found');
        }

        if(subCategoryId){
            const sub = await this.subService.findOneById(subCategoryId)
            if(!sub) throw new NotFoundException('sub-category not found');
        }

        if(!Object.values(lng).includes(lang)){
            throw new BadRequestException(`invalid language name :${name}`)
        }
        
        return this.repo.create({
            lang,
            title,
            description,
            specification,
            price,
            quantity,
            images,
            categoryId,
            subCategoryId
        });
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

    async findByLang(lang:lng){
        console.log(await this.langService.findDefault());
        
        if(!lang){
            //@ts-ignore
            lang = await this.langService.findDefault()
        }
        return this.repo.findAll({where:{lang}})
    }

    async findByDefaultLang(lang:lng){
        const defaultLang = await this.langService.findDefault()
        return this.repo.findAll({where:{lang:defaultLang}})
    }

    /*

        localized

    */

    async createLocalized(productId:string,lang:lng,title:string,description:string,specification:string){
        const product = await this.repo.findByPk(productId)
        if(!product) throw new NotFoundException('product not found');

        const localized = await this.LRepo.findOne({where:{productId,lang}})
        if(localized || product.lang === lang) throw new BadRequestException('you already have localized this product');

        if(!Object.values(lng).includes(lang)){
            throw new BadRequestException(`invalid language name :${lang}`)
        }

        return this.LRepo.create({
            productId,
            lang,
            title,
            description,
            specification
        })
    }

    async updateLocalized(productId:string,localizedId:string,lang:lng,title:string,description:string,specification:string){
        const product = await this.repo.findByPk(productId)
        const localized = await this.LRepo.findOne({where:{id:localizedId,productId}})
        if(!localized) throw new NotFoundException('localized product not found');

        if(lang){
            if(!Object.values(lng).includes(lang)){
                throw new BadRequestException(`invalid language name :${name}`)
            }

            if(product.lang == lang) throw new BadRequestException('you already have localized this product');
        }

        localized.set({
            lang,
            title,
            description,
            specification
        });

        await localized.save()
        return localized;
    }

    async deleteLocalized(id:string){
        const localized = await this.LRepo.findByPk(id)
        if(!localized) throw new NotFoundException('localized product not found');

        return localized.destroy()
    }

    findAllLocalized(){
        return this.LRepo.findAll()
    }

    findLocalized(id:string){
        return this.LRepo.findByPk(id)
    }

    getLocalized(productIds:string[]){
        return this.LRepo.findAll({where:{productId:productIds}})
    }

    findLocalizedByLang(lang:lng){
        return this.LRepo.findAll({where:{lang}})
    }

}