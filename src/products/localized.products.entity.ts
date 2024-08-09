import { Field, ObjectType } from "@nestjs/graphql";
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Index, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Products } from "./products.entity";
import { lng } from "src/system-langs/sys.lang.entity";

@Table
@ObjectType()
export class LocalizedProducts extends Model{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id:string;

    @Column({allowNull:false})
    @Field()
    lang:lng

    @Column({allowNull:false})
    @Index
    @Field()
    title:string;

    @Column({allowNull:false})
    @Field()
    description:string;

    @Column({allowNull:false})
    @Field()
    specification:string;

    @ForeignKey(()=> Products)
    @Column({ allowNull: false, type: DataType.BIGINT })
    @Field({nullable:false})
    productId:string;

    @BelongsTo(()=>Products)
    products:Products;
    

}