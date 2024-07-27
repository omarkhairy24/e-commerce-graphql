import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";

export enum lng {
    ar = 'ar',
    en = 'en',
    fr = 'fr'
}

registerEnumType(lng ,{name:'lng'})

@Table
@ObjectType()
export class Language extends Model {
  
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  @Field()
  id: string;

  @Unique
  @Column
  @Field(()=>lng,{nullable:true})
  name: lng;

  @Column({ defaultValue: false })
  @Field()
  isDefault: boolean;
}