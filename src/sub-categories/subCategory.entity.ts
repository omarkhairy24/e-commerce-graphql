import { Field, ObjectType } from "@nestjs/graphql";
import { Column,Table,DataType,Model, PrimaryKey, AutoIncrement, HasMany, ForeignKey, Index } from "sequelize-typescript";
import { Categories } from "src/categories/categories.entity";
import { Products } from "src/products/products.entity";

@Table
@ObjectType()
export class SubCategories extends Model{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id:string;

    @Column(DataType.STRING)
    @Index
    @Field({nullable:false})
    name:string;

    @ForeignKey(()=> Categories)
    @Column({ allowNull: true, type: DataType.BIGINT })
    @Index
    @Field({nullable:false})
    categoryId:string;

    @HasMany(()=>Products,{ onDelete: 'CASCADE' })
    products:Products[];
}