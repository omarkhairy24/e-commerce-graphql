import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Products } from "./products.entity";
import { ProductService } from "./products.service";
import { NotFoundException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/user/guards/GqlAuthGuard";
import {  ROLE } from "src/user/guards/decorator/role.decorator";
import { Role } from "src/user/user.entity";
import { RolesGuard } from "src/user/guards/role.guard";
import { IsVerified } from "src/user/guards/decorator/isVerified.decorator";
import { isVerifiedGuard } from "src/user/guards/isVerified.guard";
import { FileUpload } from "graphql-upload-ts/dist/Upload";
import { GraphQLUpload } from "graphql-upload-ts/dist/GraphQLUpload";
import { UploadService } from "src/upload.service";
import * as fs from 'fs'
import { join } from "path";
import { LoaderService } from "src/loader/loader.service";
import { Categories } from "src/categories/categories.entity";
import { SubCategories } from "src/sub-categories/subCategory.entity";
import { LocalizedProducts } from "./localized.products.entity";
import { lng } from "src/system-langs/sys.lang.entity";
import { Lang } from "src/system-langs/decorators/language.decorator";

@Resolver(()=>Products)
export class ProductResolver {
    constructor(
        private productService:ProductService,
        private uploadService : UploadService,
        private loaderService:LoaderService
    ){}

    @Query(()=>[Products])
    async getProducts(){
        return this.productService.findAll()
    }

    @Query(()=>Products)
    async getProduct(
        @Args('id') id:string
    ){
        return this.productService.findOneById(id)
    }

    @Query(()=>[Products])
    async getAlldByLang(
        @Lang() lang:lng
    ){
        return this.productService.findByLang(lang)
    }

    @ResolveField('category',()=>[Categories])
    async category(@Parent() products:Products){
        if (!products.categoryId) {
            return [];
        }
        return this.loaderService.categoryLoader.load(products.categoryId)
    }

    @ResolveField('localizedData',()=>[LocalizedProducts])
    async localizedData(@Parent() products:Products){
        return this.loaderService.localizedLoader.load(products.id)
    }

    @ResolveField('subCategory',()=>[SubCategories])
    async subCategory(@Parent() products:Products){
        if (!products.subCategoryId) {
            return [];
        }
        return this.loaderService.subLoader.load(products.subCategoryId)
    }

    @Mutation(()=>Products)
    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    async addProduct(
        @Args('lang') lang:lng,
        @Args('title') title:string,
        @Args('description') description:string,
        @Args('specification') specification:string,
        @Args('price') price:number,
        @Args('quantity') quantity:number,
        @Args({name:'files' , type:() =>[GraphQLUpload]}) files:FileUpload[],
        @Args('categoryId',{nullable:true}) categoryId:string,
        @Args('subCategoryId',{nullable:true}) subCategoryId:string,
    ){  
        const imageUrl = await this.uploadService.uploadImages(files)
        return this.productService.create(lang,title,description,specification,price,quantity,imageUrl,categoryId,subCategoryId);
    }

    @Mutation(()=>Products)
    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    async editProduct(
        @Args('id') id:string,
        @Args('lang') lang:lng,
        @Args('title',{nullable:true}) title:string,
        @Args('description',{nullable:true}) description:string,
        @Args('specification',{nullable:true}) specification:string,
        @Args('price',{nullable:true}) price:number,
        @Args('quantity',{nullable:true}) quantity:number,
        @Args({name:'oldImages',type:()=> [String] ,nullable:true}) oldImages:string[],
        @Args({name:'files' , type:() =>[GraphQLUpload],nullable:true}) files:FileUpload[],
    ){
        const product = await this.productService.findOneById(id)
        if(!product) throw new NotFoundException();

        let allImages = []
        if(!oldImages && product.images.length > 0){
            product.images.forEach(image =>{
                fs.unlinkSync(join(`uploads/${image}`))
            })   
        }
        if(Array.isArray(oldImages)){ allImages.push(...oldImages) } else { allImages.push(oldImages) };
        if(files){
            let imageUrls = await this.uploadService.uploadImages(files)
            allImages.push(...imageUrls)
        }

        product.set({
            lang,
            title,
            description,
            specification,
            price,
            quantity,
            images:allImages
        })

        await product.save()
        return product
    }

    @Mutation(()=>Boolean)
    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    async deleteProduct(
        @Args('id') id:string
    ){
        await this.productService.remove(id)
        return true
    }
}
