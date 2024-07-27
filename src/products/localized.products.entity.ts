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

    @Column
    @Field({nullable:false})
    lang:lng

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

    @ForeignKey(()=> Products)
    @Column({ allowNull: true, type: DataType.BIGINT })
    @Index
    @Field({nullable:false})
    productId:string;

    @BelongsTo(()=>Products)
    products:Products;
    

}