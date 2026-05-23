import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/schema/user.schema";
import { Machine, MachineDocument } from "./schema/machine.schema";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";
import { SensorData, SensorDataDocument } from "./schema/sensor.schema";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "src/common/utils/email.util";
import { MachineCreateDto } from "./dto/machine-create.dto";
import { Types } from 'mongoose';
import { createAuditLog } from "src/common/utils/auditlogs.util";

@Injectable()
export class MachineService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        @InjectModel(Machine.name)
        private readonly machineModel: Model<MachineDocument>,

        @InjectModel(AuditLog.name)
        private readonly auditlogModel: Model<AuditLogDocument>,

        @InjectModel(SensorData.name)
        private readonly sensorDataModel: Model<SensorDataDocument>,

        private jwtService: JwtService,
        private emailService: EmailService
    ) { }

    async CreateMachine(
        token: string,
        dto: MachineCreateDto,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.email })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const checkmachine = await this.machineModel.findOne({
            serialNumber: dto.serialNumber,
        }).exec();

        if (checkmachine) {
            throw new ConflictException("Machine Already Created")
        }

        const createMachine = await this.machineModel.create({
            name: dto.name,
            type: dto.type,
            model: dto.model,
            serialNumber: dto.serialNumber,
            factoryId: new Types.ObjectId(dto.factoryId),
            productionLineId: new Types.ObjectId(dto.productionLineId),
        } as any);

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "MACHINE_CREATED_SUCCESS",
            description: `Machine Created Success by ${user.email}`,
            ipAddress,
            userAgent,
            metadata: {
                ipAddress,
                userAgent,
            },
        });

        return {
            success: true,
            message: "Machine Created Success",
        }
    }
}