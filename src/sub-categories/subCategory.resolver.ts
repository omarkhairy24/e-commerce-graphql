import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import {  UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/user/guards/GqlAuthGuard";
import {  ROLE } from "src/user/guards/decorator/role.decorator";
import { Role } from "src/user/user.entity";
import { RolesGuard } from "src/user/guards/role.guard";
import { IsVerified } from "src/user/guards/decorator/isVerified.decorator";
import { isVerifiedGuard } from "src/user/guards/isVerified.guard";
import { SubCategories } from "./subCategory.entity";
import { SubService } from "./subCategory.service";
import { Products } from "src/products/products.entity";
import { LoaderService } from "src/loader/loader.service";
import { Categories } from "src/categories/categories.entity";

@Resolver(() => SubCategories)
export class SubResolver{
    constructor(
        private subService:SubService,
        private loaderService:LoaderService
    ){}

    @Query(()=>SubCategories)
    async getSubCategorie(
        @Args('categoryId') categoryId:string
    ){
        return this.subService.findAll(categoryId)
    }

    @ResolveField('products',()=>[Products])
    async products(@Parent() subCategory:SubCategories){
        return this.loaderService.prodSubLoader.load(subCategory.id)
    }

    @ResolveField('category', () => [Categories])
    async category(@Parent() subCategory: SubCategories) {
        return this.loaderService.categoryLoader.load(subCategory.categoryId);
    }

    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    @Mutation(()=>SubCategories)
    async addSubCateogry(
        @Args('categoryId') categoryId:string,
        @Args('name') name:string
    ){
        return this.subService.create(categoryId,name)
    }

    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    @Mutation(()=>SubCategories)
    async editSubCateogry(
        @Args('id') id:string,
        @Args('name') name:string
    ){
        return this.subService.update(id,name)
    }

    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    @Mutation(()=>Boolean)
    async deleteSubCateogry(
        @Args('id') id:string
    ){
        this.subService.delete(id)
        return true
    }
}