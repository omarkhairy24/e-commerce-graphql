import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Products } from "./products.entity";
import { ProductService } from "./products.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/user/guards/GqlAuthGuard";
import {  ROLE } from "src/user/guards/decorator/role.decorator";
import { Role } from "src/user/user.entity";
import { RolesGuard } from "src/user/guards/role.guard";
import { IsVerified } from "src/user/guards/decorator/isVerified.decorator";
import { isVerifiedGuard } from "src/user/guards/isVerified.guard";
import { LoaderService } from "src/loader/loader.service";
import { LocalizedProducts } from "./localized.products.entity";
import { lng } from "src/system-langs/sys.lang.entity";
import { Lang } from "src/system-langs/decorators/language.decorator";

@Resolver(()=>LocalizedProducts)
export class LocaziedResolver {
    constructor(
        private productService:ProductService,
        private loaderService:LoaderService
    ){}

    @Query(()=>[LocalizedProducts])
    @IsVerified(true)
    @ROLE(Role.Admin)
    async getLocalized(){
        return await this.productService.findAllLocalized()
    }

    @Query(()=>LocalizedProducts)
    async getSingleLocalized(
        @Args('id') id:string
    ){
        return await this.productService.findLocalized(id)
    }

    @Query(()=>[LocalizedProducts])
    async getLocalizedByLang(
        @Lang() lang:lng
    ){
        return this.productService.findLocalizedByLang(lang)
    }

    @ResolveField('products',()=>[Products])
    async products(@Parent() localized:LocalizedProducts){
        return this.loaderService.productLoader.load(localized.productId)
    }

    @Mutation(()=>LocalizedProducts)
    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    async addLocalizedProduct(
        @Args('productId') productId:string,
        @Args('lang') lang:lng,
        @Args('title',{nullable:false}) title:string,
        @Args('description',{nullable:false}) description:string,
        @Args('specification',{nullable:false}) specification:string,
    ){
        return await this.productService.createLocalized(productId,lang,title,description,specification);
    }

    @Mutation(()=>LocalizedProducts)
    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    async editLocalizedProduct(
        @Args('productId') productId:string,
        @Args('localizedId') localizedId:string,
        @Args('lang',{nullable:true}) lang:lng,
        @Args('title',{nullable:true}) title:string,
        @Args('description',{nullable:true}) description:string,
        @Args('specification',{nullable:true}) specification:string,
    ){
        return await this.productService.updateLocalized(productId,localizedId,lang,title,description,specification);
    }

    @Mutation(()=>Boolean)
    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    async deleteLocalizedProduct(
        @Args('localizedId') localizedId:string,
    ){
        await this.productService.deleteLocalized(localizedId);
        return true
    }
}
