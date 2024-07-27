import { Field, ObjectType } from "@nestjs/graphql";
import { Role } from "../user.entity";


@ObjectType()
export class UserResponse {

  @Field()
  id:string

  @Field()
  username: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({nullable:true})
  image: string;

  @Field()
  role:Role
}

@ObjectType()
export class LoginResponse {
  @Field()
  token: string;

  @Field(() => UserResponse)
  user:UserResponse
}