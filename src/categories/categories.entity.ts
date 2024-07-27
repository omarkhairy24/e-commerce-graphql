import { Field, ObjectType } from "@nestjs/graphql";
import { Column,Table,DataType,Model, PrimaryKey, AutoIncrement, HasMany, Index } from "sequelize-typescript";
import { Products } from "src/products/products.entity";
import { SubCategories } from "src/sub-categories/subCategory.entity";

@Table
@ObjectType()
export class Categories extends Model{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id:string;

    @Column(DataType.STRING)
    @Index
    @Field({nullable:false})
    name:string;

    @HasMany(()=>SubCategories, { onDelete: 'CASCADE' })
    subCategoires:SubCategories[];

    @HasMany(()=>Products, { onDelete: 'CASCADE' })
    products:Products[];
}