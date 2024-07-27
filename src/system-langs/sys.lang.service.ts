import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Language, lng } from "./sys.lang.entity";

@Injectable()
export class LangService {
    constructor(
        @InjectModel(Language) private repo :typeof Language
    ){}

    async createLan(name:lng,isDefault:boolean){
        if(!Object.values(lng).includes(name)){
            throw new BadRequestException(`invalid language name :${name}`)
        } 

        if(isDefault && isDefault === true){
            const Default = await this.repo.findOne({where:{isDefault:true}})
            if(Default){
                Default.isDefault = false
                await Default.save()
            }
        }

        return this.repo.create({name,isDefault})
    }

    findAll(){
        return this.repo.findAll()
    }

    async findDefault(){
        const isDefault = await this.repo.findOne({where:{isDefault:true}})
        return isDefault.name
    }

    async updateLang(id:string,name:lng,isDefault:boolean){
        const lang = await this.repo.findByPk(id)
        if(!lang) throw new NotFoundException('language not found');

        if(name){
            if(!Object.values(lng).includes(name)){
                throw new BadRequestException(`invalid language name :${name}`)
            }
        }

        if(isDefault && isDefault === true){
            const Default = await this.repo.findOne({where:{isDefault:true}})
            if(Default){
                Default.isDefault = false
                await Default.save()
            }
        }

        lang.set({
            name,
            isDefault
        })
        await lang.save()
        return lang
    }

    async remove(id:string){
        const lang = await this.repo.findByPk(id)
        if(!lang) throw new NotFoundException('language not found');

        return lang.destroy()
    }
}