import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { NotFoundException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/GqlAuthGuard";
import { UserResponse } from "./dto/user.dto";
import { UploadService } from "src/upload.service";
import { UpdateInfo } from "./dto/update.user.dto";
import { FileUpload } from "graphql-upload-ts/dist/Upload";
import { GraphQLUpload } from "graphql-upload-ts/dist/GraphQLUpload";
import * as fs from 'fs';

@Resolver(()=>User)
export class UserResolver{
    constructor(
        private userService:UserService,
        private uploadService:UploadService
    ){}

    @Query(()=>UserResponse)
    @UseGuards(JwtAuthGuard)
    async getMe(
        @Context('req') req
    ){
        return await this.userService.findOneById(req.user.id)
    }

    @Mutation(()=>UserResponse)
    @UseGuards(JwtAuthGuard)
    async updateMe(
        @Args({name:'input' , type:()=>UpdateInfo}) input:UpdateInfo,
        @Args({name:'file' , type:() =>GraphQLUpload , nullable:true}) file:FileUpload,
        @Context('req') req
    ){
        const user = await this.userService.findOneById(req.user.id);
        if(!user) throw new NotFoundException();

        user.set(input)
        if(file){
            if(user.image){
                fs.unlinkSync(`uploads/${user.image}`)
            }
            const imageUpload = await this.uploadService.uploadFile(file)
            user.image = imageUpload
        }
        
        await user.save()
        return user
    }
}