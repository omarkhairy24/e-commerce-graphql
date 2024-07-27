import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { SubCategories } from "./subCategory.entity";
import { CategoryService } from "src/categories/categories.service";

@Injectable()
export class SubService {
    constructor(
        @InjectModel(SubCategories) private repo :typeof SubCategories,
        private categoryService:CategoryService
    ){}

    async create(categoryId:string ,name:string){
        const category = await this.categoryService.findOneById(categoryId)
        if(!category) throw new NotFoundException('category not found');

        return this.repo.create({
            name,
            categoryId
        })
    }

    findOneById(id:string){
        return this.repo.findByPk(id)
    }

    findAll(categoryId:string){
        return this.repo.findAll()
    }

    async update(id:string,newName:string){
        const subCategory = await this.repo.findByPk(id)
        if(!subCategory) throw new NotFoundException();
        subCategory.name = newName;
        await subCategory.save()
        return subCategory;
    }

    async delete(id:string){
        const subCategory = await this.repo.findByPk(id)
        if(!subCategory) throw new NotFoundException();
        return subCategory.destroy()
    }

    async findByCatIds(catIds:string[]){
        return this.repo.findAll({where:{categoryId:catIds}})
    }

    findAllByIds(ids:string[]){
        return this.repo.findAll({where:{id:ids}})
    }

}