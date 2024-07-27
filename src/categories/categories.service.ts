import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Categories } from "./categories.entity";

@Injectable()
export class CategoryService{

    constructor(
        @InjectModel(Categories) private repo: typeof Categories
    ){}

    create(name:string){
        return this.repo.create({name})
    }

    findOneById(id:string){
        return this.repo.findByPk(id)
    }

    findAll(){
        return this.repo.findAll()
    }

    async update(id:string,newName:string){
        const category = await this.repo.findByPk(id)
        if(!category) throw new NotFoundException();
        category.name = newName;
        await category.save()
        return category;
    }

    async deleteCategory(id:string){
        const category = await this.repo.findByPk(id)
        if(!category) throw new NotFoundException();
        return category.destroy()
    }

    findAllByIds(ids:string[]){
        return this.repo.findAll({where:{id:ids}})
    }
}