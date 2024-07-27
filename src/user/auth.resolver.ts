import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { RegisterInput } from "./dto/register.dto";
import { BadRequestException, NotFoundException, UseGuards } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { randomInt } from "crypto";
import { loginInput } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { UserResponse, LoginResponse } from "./dto/user.dto";
import { ResetInput } from "./dto/reset.dto";
import { JwtAuthGuard } from "./guards/GqlAuthGuard";

import { isVerifiedGuard } from "./guards/isVerified.guard";
import { IsVerified } from "./guards/decorator/isVerified.decorator";
import { ROLE } from "./guards/decorator/role.decorator";
import { RolesGuard } from "./guards/role.guard";

@Resolver(()=>User)
export class AuthResolver{
    constructor(private userService: UserService , private jwtService :JwtService){}

    @Query(() =>[UserResponse])
    @UseGuards(JwtAuthGuard,isVerifiedGuard,RolesGuard)
    @IsVerified(true)
    @ROLE('Admin')
    async getUsers():Promise<User[]>{
        return this.userService.findAll();
    }

    @Mutation(()=>String ,{name:'register'})
    async register(@Args('input',{type:()=>RegisterInput}) input:RegisterInput){

        const transaction = await this.userService.startTransaction();
        
        const checkEmail = await this.userService.find(input.email);
        if(checkEmail) {
            if(!checkEmail.isVerified) await this.userService.remove(checkEmail.id);
            if(checkEmail.isVerified) throw new BadRequestException('this email already in use');
        }

        const checkUsername = await this.userService.findOne(input.username)
        if(checkUsername) throw new BadRequestException('this username is already in use');

        const otp = randomInt(100000, 999999).toString()
        const [hashedPassword,hasedOtp] = await Promise.all([
            this.userService.Hash(input.password),
            this.userService.Hash(otp)
        ])

        input.otp = hasedOtp
        input.password = hashedPassword;
        
        await this.userService.create(input,transaction)

        try{

            this.userService.sendCode(input.email,otp)
            transaction.commit();

        }catch(err){
            transaction.rollback();
            return err
        }

        return 'verification code sent to your email'
    }

    @Mutation(() => UserResponse ,{name:'verify_user'})
    async verifyUser(
        @Args('otp') otp:string,
        @Args('email') email:string
    ){
        const user = await this.userService.find(email);
        if(!user) throw new NotFoundException();

        if(user.isVerified){
            throw new BadRequestException('this user already verified');
        }

        const checkOtp = await bcrypt.compare(otp,user.otp)
        if(!checkOtp) {
            await this.userService.remove(user.id)
            throw new BadRequestException('The OTP entered is incorrect');
        }

        user.otp = null;
        user.isVerified = true;
        await user.save()
        return user
    }

    @Mutation(()=>LoginResponse , {name:'login'})
    async login(@Args('input') input:loginInput){
        const user = await this.userService.find(input.email)
        if(!user || !user.isVerified) throw new BadRequestException('email or password not correct');

        const correctPass = await bcrypt.compare(input.password , user.password);
        if(!correctPass) throw new BadRequestException('email or password not correct');

        const payload = {sub:user.id , role:user.role}
        
        let token = this.jwtService.sign(payload)

        return{token , user}
    }

    @Mutation(() => String ,{name:'forget_password'})
    async forgetPassword(
        @Args('email') email:string
    ){
        const user = await this.userService.find(email);
        if(!user) throw new NotFoundException();

        const otp = randomInt(100000,999999).toString();
        const hasedOtp = await this.userService.Hash(otp)

        try{
            this.userService.sendCode(email , otp)
            user.otp = hasedOtp;
            await user.save()
            return 'code sent to your mail'
        }catch(err){
            throw new err;
        }
    }

    @Mutation(()=>UserResponse , {name:'reset_password'})
    async resetPassword(
        @Args('input') input:ResetInput
    ){
        const user = await this.userService.find(input.email);
        if(!user) throw new NotFoundException();
        if(!user.otp) throw new BadRequestException();

        const matchedOtp = await bcrypt.compare(input.otp,user.otp)
        if(!matchedOtp) throw new BadRequestException('incorrect otp');

        const hasedPass = await this.userService.Hash(input.password)
        user.password = hasedPass
        user.otp = null
        await user.save()
        return user
    }

    @Mutation(()=>UserResponse,{name:'update_password'})
    @UseGuards(JwtAuthGuard)
    async updatePassword(
        @Args('oldPassword') oldPassword:string,
        @Args('newPassword') newPassword:string,
        @Context('req') req
    ){
        const user = await this.userService.findOneById(req.user.id)
        if(!user) throw new NotFoundException();

        const isMatched = await bcrypt.compare(oldPassword,user.password);
        if(!isMatched) throw new BadRequestException('The passwords you entered do not match. Please try again.');

        user.password = await this.userService.Hash(newPassword);
        await user.save()
        return user
    }
    
}