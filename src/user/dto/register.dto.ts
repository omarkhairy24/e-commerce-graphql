import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Role } from "../user.entity";

@InputType()
export class RegisterInput{
    @Field()
    @IsNotEmpty()
    @MinLength(3)
    username:string

    @Field()
    @IsNotEmpty()
    @MinLength(3)
    name:string

    @Field()
    @IsNotEmpty()
    @IsEmail()
    email:string

    @Field()
    @IsNotEmpty()
    @MinLength(3)
    password:string;

    @Field()
    @IsNotEmpty()
    role:Role

    @IsNotEmpty()
    otp:string

}