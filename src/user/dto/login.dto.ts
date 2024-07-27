import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty } from "class-validator";

@InputType()
export class loginInput{
    @Field()
    @IsNotEmpty()
    @IsEmail()
    email:string

    @Field()
    @IsNotEmpty()
    password:string
}