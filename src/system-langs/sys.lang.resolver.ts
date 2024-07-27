import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/user/guards/GqlAuthGuard";
import {  ROLE } from "src/user/guards/decorator/role.decorator";
import { Role } from "src/user/user.entity";
import { RolesGuard } from "src/user/guards/role.guard";
import { IsVerified } from "src/user/guards/decorator/isVerified.decorator";
import { isVerifiedGuard } from "src/user/guards/isVerified.guard";
import { Language, lng } from "./sys.lang.entity";
import { LangService } from "./sys.lang.service";

@Resolver(()=>Language)
export class LangResolver{
    constructor(
        private langService:LangService
    ){}

    @Query(()=>[Language])
    async getLanguages(){
        return await this.langService.findAll()
    }

    @Query(()=>Language)
    async getDefaultLanguages(){
        return await this.langService.findDefault()
    }

    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    @Mutation(()=>Language)
    async addLang(
        @Args('name') name:lng,
        @Args('isDefault',{nullable:true}) isDefault:boolean
    ){ 
        return this.langService.createLan(name,isDefault);
    }

    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    @Mutation(()=>Language)
    async editLang(
        @Args('id') id:string,
        @Args({name:'name',nullable:true}) name:lng,
        @Args('isDefault',{nullable:true}) isDefault:boolean
    ){ 
        return this.langService.updateLang(id,name,isDefault);
    }

    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE(Role.Admin)
    @Mutation(()=>Boolean)
    async deleteLang(
        @Args('id') id:string
    ){ 
        await this.langService.remove(id);
        return true
    }

}