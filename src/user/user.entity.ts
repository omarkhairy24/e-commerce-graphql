import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { BeforeSave, Column, DataType, Model, Table, Unique } from "sequelize-typescript";

export enum Role {
    Customer = 'Customer',
    Admin = 'Admin'
}

registerEnumType(Role , {name:'Role'})

@Table
@ObjectType()
export class User extends Model{
    @Column({
        primaryKey:true,
        defaultValue:DataType.UUIDV4,
        type:DataType.UUID
    })
    @Field()
    id:string;

    @Unique
    @Column({allowNull:false})
    @Field({nullable:false})
    username:string;

    @Column({allowNull:false})
    @Field({nullable:false})
    name:string;

    @Unique
    @Column({ allowNull:false })
    @Field({nullable:false})
    email: string;

    @Column({ allowNull:false })
    @Field({nullable:false})
    password: string;
    
    @Column
    @Field({nullable:true})
    image: string;

    @Column({allowNull:false})
    @Field(()=>Role,{nullable:false})
    role:Role

    @Column({
        defaultValue:false
    })
    isVerified:boolean;

    @Column
    otp:string;

    @Column
    passwordChangedAt:Date;

    @BeforeSave
    static async setPasswordChangedAt(user:User){
        if(!user.isNewRecord && user.changed('password')){
            user.setDataValue('passwordChangedAt',Date.now() - 1000);
        }
    }
}