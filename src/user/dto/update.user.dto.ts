import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsOptional } from "class-validator";

@InputType()
export class UpdateInfo{

    @IsOptional()
    @Field({nullable:true})
    username:string;

    @IsOptional()
    @Field({nullable:true})
    name:string;

    @IsOptional()
    @Field({nullable:true})
    @IsEmail()
    email:string;
}