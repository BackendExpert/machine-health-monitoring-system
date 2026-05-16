import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuditLog, AuditLogSchema } from "src/auditlogs/schema/auditlog.schema";
import { AuthModule } from "src/auth/auth.module";
import { RoleModule } from "src/role/role.module";
import { User, UserSchema } from "src/user/schema/user.schema";
import { Factory, FactorySchema } from "./schema/factory.schema";
import { Role, RoleSchema } from "src/role/schema/role.schema";
import { ProductionLine, ProductionLineSchema } from "./schema/productionline .schema";
import { FactoryController } from "./factory.controller";
import { FactoryService } from "./factory.service";
import { EmailService } from "src/common/utils/email.util";

@Module({
    imports: [
        AuthModule,
        RoleModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }, 
            { name: Role.name, schema: RoleSchema },
            { name: AuditLog.name, schema: AuditLogSchema },
            { name: Factory.name, schema: FactorySchema },
            { name: ProductionLine.name, schema: ProductionLineSchema }            
        ])
    ],
    controllers: [FactoryController],
    providers: [
        FactoryService,
        EmailService
    ],
    exports: [FactoryService]
})

export class FactoryModule { }