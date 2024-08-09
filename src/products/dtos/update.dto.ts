import {IsNumber,IsOptional,IsString} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { lng } from 'src/system-langs/sys.lang.entity';

@InputType()
export class UpdateLocalizationInput {

    @IsString()
	@Field(() => lng, { nullable: true })
	@IsOptional()
	lang: lng;

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	title: string;

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	description: string;

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	specification: string;
}


@InputType()
export class UpdateProductInput {

	@IsNumber()
	@IsOptional()
	@Field({ nullable: true })
	price: number;

	@IsNumber()
	@IsOptional()
	@Field({ nullable: true })
	quantity: number;

	@IsString()
	@IsOptional()
	@Field({ nullable: true })
	categoryId: string;

	@IsString()
	@IsOptional()
	@Field({ nullable: true })
	subCategoryId?: string;

	images: string[];
}