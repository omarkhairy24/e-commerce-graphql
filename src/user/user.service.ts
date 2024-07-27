import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.entity";
import { MailService } from "src/mail/mail.service";
import { RegisterInput } from "./dto/register.dto";
import { Transaction } from "sequelize";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectModel(User) public repo: typeof User, private sendMail:MailService){}

    create(input:RegisterInput ,transaction:Transaction){
        return this.repo.create({
            username:input.username,name:input.name,email:input.email,password:input.password,otp:input.otp,role:input.role
        },{transaction})
    }

    sendCode(email:string,otp:string){
        this.sendMail.sendVerificationEmail(
            email,
            'verification code',
            `your otp : ${otp}`
        )
    }

    async Hash(input:string){
        const salt = await bcrypt.genSalt()
        return await bcrypt.hash(input,salt); 
    }

    async startTransaction(): Promise<Transaction> {
        return this.repo.sequelize.transaction();
    }

    findByIds(id:string[]){
        return this.repo.findAll({where:{id}})
    }

    findAll(){
        return this.repo.findAll()
    }

    find(email:string){
        return this.repo.findOne({where:{email}})
    }

    findOne(username:string){
        return this.repo.findOne({where:{username}})
    }

    findOneById(id:string){
        return this.repo.findByPk(id)
    }

    async remove(id:string){
        const user = await this.repo.findByPk(id)
        if(!user){
            throw new NotFoundException('user not found')
        }
        
        return user.destroy()
    }
}