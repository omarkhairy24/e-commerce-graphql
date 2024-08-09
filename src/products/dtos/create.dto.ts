import { IsNumber,IsOptional,IsString,} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { lng } from 'src/system-langs/sys.lang.entity';

@InputType()
export class LocalizedInput {
    @IsString()
	@Field(() => lng)
	lang: lng;

	@Field()
	@IsString()
	title: string;

	@Field()
	@IsString()
	description: string;

	@Field()
	@IsString()
	specification: string;
}

@InputType()
export class CreateProductInput {

	@IsNumber()
	@Field(() => Number)
	price: number;

	@IsNumber()
	@Field(() => Number)
	quantity: number;

	@IsString()
	@Field(() => String)
	categoryId: string;

	@IsOptional()
	@IsString()
	@Field(() => String,{nullable:true})
	subCategoryId?: string;

	images: string[];
}