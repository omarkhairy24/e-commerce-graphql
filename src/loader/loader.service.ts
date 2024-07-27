import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { CategoryService } from 'src/categories/categories.service';
import { ProductService } from 'src/products/products.service';
import { SubService } from 'src/sub-categories/subCategory.service';

@Injectable()
export class LoaderService {
    constructor(
        private productService:ProductService,
        private categoryService:CategoryService,
        private subService:SubService
    ){}

    public prodCatLoader = new DataLoader(async (catIds:string[])=>{
        const products = await this.productService.findByCategoryIds(catIds)
        const prodMap = new Map(catIds.map(catId => [catId , products.filter(prod => prod.categoryId === catId)]))
        return catIds.map(catId => prodMap.get(catId))
    })

    public subCatLoadaer = new DataLoader(async(catIds:string[])=>{
        const sub = await this.subService.findByCatIds(catIds);
        const subMap = new Map(catIds.map(catId => [catId , sub.filter(subcat => subcat.categoryId === catId)]))
        return catIds.map(catId => subMap.get(catId))
    })

    public prodSubLoader = new DataLoader(async (subIds:string[])=>{
        const products = await this.productService.findBySubIds(subIds)
        const prodMap = new Map(subIds.map(subId => [subId , products.filter(prod => prod.subCategoryId === subId)]))
        return subIds.map(subId => prodMap.get(subId))
    })

    public categoryLoader = new DataLoader(async (catIds: string[]) => {
        const categories = await this.categoryService.findAllByIds(catIds);
        const catMap = new Map(catIds.map(catId => [catId, categories.filter(category => category.id === catId)]));
        return catIds.map(catId => catMap.get(catId));
    });

    public subLoader = new DataLoader(async (subIds:string[])=>{
        const SubCategories = await this.subService.findAllByIds(subIds);
        const subMaps = new Map(subIds.map(subId => [subId , SubCategories.filter(sub => sub.id === subId)]));
        return subIds.map(subId => subMaps.get(subId));
    })

    public localizedLoader = new DataLoader(async(prodIds:string[])=>{
        const localized = await this.productService.getLocalized(prodIds)
        const localizedMap = new Map(prodIds.map(prodId => [prodId , localized.filter(lp => lp.productId === prodId)]))
        return prodIds.map(prodId => localizedMap.get(prodId))
    })

    public productLoader = new DataLoader(async(prodIds:string[])=>{
        const products = await this.productService.findByIds(prodIds);
        const productsMap = new Map(prodIds.map(prodId => [prodId,products.filter(prod => prod.id === prodId)]))
        return prodIds.map(prodId => productsMap.get(prodId))
    })
    
}
