import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { RoleModule } from "src/role/role.module";
import { User, UserSchema } from "src/user/schema/user.schema";
import { Machine, MachineSchema } from "./schema/machine.schema";
import { AuditLog, AuditLogSchema } from "src/auditlogs/schema/auditlog.schema";
import { SensorData, SensorDataSchema } from "./schema/sensor.schema";
import { MachineController } from "./machine.controller";
import { MachineService } from "./machine.service";
import { EmailService } from "src/common/utils/email.util";

@Module({
    imports: [
        RoleModule,
        AuthModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Machine.name, schema: MachineSchema },
            { name: AuditLog.name, schema: AuditLogSchema }, 
            { name: SensorData.name, schema: SensorDataSchema }
        ])
    ],
    controllers: [MachineController],
    providers: [
        MachineService,
        EmailService
    ],
    exports: [MachineService]
})

export class MachineModule { }