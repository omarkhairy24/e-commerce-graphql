import { Field, ObjectType } from "@nestjs/graphql";
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Index, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Categories } from "src/categories/categories.entity";
import { SubCategories } from "src/sub-categories/subCategory.entity";
import { LocalizedProducts } from "./localized.products.entity";
import { lng } from "src/system-langs/sys.lang.entity";

@Table
@ObjectType()
export class Products extends Model{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id:string;

    @Column
    @Field({nullable:true})
    lang:lng;

    @Column
    @Index
    @Field({nullable:true})
    title:string;

    @Column
    @Field({nullable:true})
    description:string;

    @Column
    @Field({nullable:true})
    specification:string;

    @Column
    @Index
    @Field({nullable:true})
    price:number;

    @Column
    @Field({nullable:true})
    quantity:number;

    @Column(DataType.JSON)
    @Index
    @Field(()=>[String],{nullable:true})
    images:string[]

    @ForeignKey(()=> Categories)
    @Column({ allowNull: true, type: DataType.BIGINT })
    @Index
    @Field({nullable:true})
    categoryId:string;

    @BelongsTo(()=>Categories)
    categories:Categories;

    @ForeignKey(()=> SubCategories)
    @Column({ allowNull: true, type: DataType.BIGINT })
    @Index
    @Field({nullable:true})
    subCategoryId:string;

    @BelongsTo(()=>SubCategories)
    subCategories:SubCategories;

    @HasMany(()=>LocalizedProducts, { onDelete: 'CASCADE' })
    localizedProducts:LocalizedProducts[]

}