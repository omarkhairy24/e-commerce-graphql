import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Role } from "../user.entity";

@InputType()
export class ResetInput{

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
    otp:string

}