import { Field, ObjectType } from "@nestjs/graphql";
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Categories } from "src/categories/categories.entity";
import { SubCategories } from "src/sub-categories/subCategory.entity";
import { LocalizedProducts } from "./localized.products.entity";

@Table
@ObjectType()
export class Products extends Model{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id:string;

    @Column({allowNull:false})
    @Field({nullable:true})
    price:number;

    @Column({allowNull:false})
    @Field({nullable:true})
    quantity:number;

    @Column({type:DataType.JSON,allowNull:false})
    @Field(()=>[String],{nullable:true})
    images:string[]

    @ForeignKey(()=> Categories)
    @Column({type: DataType.BIGINT,allowNull:false})
    @Field({nullable:false})
    categoryId:string;

    @BelongsTo(()=>Categories)
    categories:Categories;

    @ForeignKey(()=> SubCategories)
    @Column({type: DataType.BIGINT})
    @Field({nullable:true})
    subCategoryId:string;

    @BelongsTo(()=>SubCategories)
    subCategories:SubCategories;

    @HasMany(()=>LocalizedProducts, { onDelete: 'CASCADE' })
    localizedProducts:LocalizedProducts[]

}