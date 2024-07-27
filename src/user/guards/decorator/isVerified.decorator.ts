import { SetMetadata } from "@nestjs/common";

export const IsVerified = (isVerified:boolean) =>{
    return SetMetadata('isVerified',isVerified)
}