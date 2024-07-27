import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import {  UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/user/guards/GqlAuthGuard";
import {  ROLE } from "src/user/guards/decorator/role.decorator";
import { Role } from "src/user/user.entity";
import { RolesGuard } from "src/user/guards/role.guard";
import { IsVerified } from "src/user/guards/decorator/isVerified.decorator";
import { isVerifiedGuard } from "src/user/guards/isVerified.guard";
import { Categories } from "./categories.entity";
import { CategoryService } from "./categories.service";
import { LoaderService } from "src/loader/loader.service";
import { Products } from "src/products/products.entity";
import { SubCategories } from "src/sub-categories/subCategory.entity";

@Resolver(() => Categories)
export class CategoryResolver {
    constructor(
        private categoryService:CategoryService,
        private loaderService:LoaderService
    ){}

    @Query(() =>[Categories])
    async getCategories(){
        return this.categoryService.findAll()
    }

    @Query(() => Categories)
    async getCategory(
        @Args('id') id:string
    ){
        return this.categoryService.findOneById(id)
    }

    
    @ResolveField('products',()=>[Products])
    async products(@Parent() category:Categories){
        return this.loaderService.prodCatLoader.load(category.id)
    }

    @ResolveField('subCategoires',()=>[SubCategories])
    async subCategories(@Parent() category:Categories){
        return this.loaderService.subCatLoadaer.load(category.id)
    }

    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    @Mutation(() => Categories)
    async addCategory(
        @Args('name') name:string
    ){
        return this.categoryService.create(name)
    }

    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    @Mutation(() => Categories)
    async updateCategory(
        @Args('id') id:string,
        @Args('newName') newName:string
    ){
        return this.categoryService.update(id,newName);
    }

    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    @Mutation(() => Boolean)
    async deleteCategory(
        @Args('id') id:string
    ){
        this.categoryService.deleteCategory(id);
        return true
    }

}