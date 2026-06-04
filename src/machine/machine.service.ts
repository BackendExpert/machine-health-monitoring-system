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
import { ProductionLine, ProductionLineDocument } from "src/factory/schema/productionline .schema";
import { Factory, FactoryDocument } from "src/factory/schema/factory.schema";
import { Cron } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MachineService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        @InjectModel(Machine.name)
        private readonly machineModel: Model<MachineDocument>,

        @InjectModel(AuditLog.name)
        private readonly auditlogModel: Model<AuditLogDocument>,

        @InjectModel(ProductionLine.name)
        private readonly producationlineModel: Model<ProductionLineDocument>,

        @InjectModel(Factory.name)
        private readonly factoryModel: Model<FactoryDocument>,

        @InjectModel(SensorData.name)
        private readonly sensorDataModel: Model<SensorDataDocument>,

        private jwtService: JwtService,
        private emailService: EmailService,
        private readonly configService: ConfigService,
    ) { }

    // @Cron("0 */15 * * * *")
    @Cron("*/15 * * * * *")

    async CreateMachineSensorData() {
        console.log("⚡ Fetching machine sensor data", new Date().toISOString());

        const baseUrl = this.configService.get<string>('API_BASE_URL');
        const client_id = this.configService.get<string>('API_CLIENT_ID');
        const secret = this.configService.get<string>('API_SECRET');
        const path = this.configService.get<string>('API_GENERATE_RANDOM_PATH');
        const method = this.configService.get<string>('API_METHOD');

        const url = `${baseUrl}${path}`;

        const payload = { tenant_id: "tenant_001" };
        const body = JSON.stringify(payload);

        const timestamp = Math.floor(Date.now() / 1000).toString();
        const nonce = crypto.randomUUID();

        const bodyHash = Buffer.from(
            require("crypto")
                .createHash("sha256")
                .update(body)
                .digest()
        ).toString("base64");

        const canonicalString = [
            method,
            path,
            timestamp,
            nonce,
            bodyHash
        ].join("\n");

        const signature = Buffer.from(
            require("crypto")
                .createHmac("sha256", secret)
                .update(canonicalString)
                .digest()
        ).toString("base64");

        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "X-Client-Id": client_id || '',
            "X-Timestamp": timestamp,
            "X-Nonce": nonce,
            "X-Signature": signature
        };

        const res = await fetch(url, {
            method,
            headers,
            body
        });

        const data = await res.json();

        if (!data.sensor_data || !Array.isArray(data.sensor_data)) {
            console.log("❌ No sensor data found");
            return;
        }

        const now = new Date();

        const sensors = data.sensor_data.map((item: any) => ({
            mid: item.mid,
            machineId: item.machineId,
            temperature: item.temperature,
            vibration: item.vibration,
            pressure: item.pressure,
            rpm: item.rpm,
            load: item.load,
            status: item.status || ['normal'],
            dayOfWeek: item.dayOfWeek,
            hourOfDay: item.hourOfDay,
            minuteOfHour: item.minuteOfHour,
            penalty: item.penalty || 0,
            recordedAt: new Date(item.recordedAt)
        }));

        await this.sensorDataModel.create({
            timestamp: now,
            sensor_data: sensors
        });

        for (const item of sensors) {
            await this.machineModel.updateOne(
                { _id: item.machineId },
                { $inc: { healthScore: -item.penalty } }
            );
        }


        console.log("✅ Machine sensor data stored successfully");
    }







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

        const produactionlines = await this.producationlineModel.findById(
            dto.productionLineId
        )

        if (!produactionlines) {
            throw new NotFoundException("Producation Line Cannot be Found")
        }

        const machineCount = await this.machineModel.countDocuments({
            productionLineId: produactionlines._id
        })

        if (machineCount >= produactionlines.max_machines) {
            throw new ConflictException(
                "Max Machines for ProductionLine has been passed"
            )
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

    async FetchAllMachines(
        token: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.email })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const fetchallMachine = await this.machineModel
            .find()
            .populate('factoryId')
            .populate('productionLineId');

        return {
            success: true,
            message: "All Machine Fetched Success",
            result: fetchallMachine
        }
    }

    async FetchPlantAdminMachine(
        token: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.email })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const getfactory = await this.factoryModel.findOne({ plant_admin: user._id })

        if (!getfactory) {
            throw new NotFoundException("Factory Cannot be Found by Currnt User")
        }

        const getmachines = await this.machineModel.find(
            { factoryId: getfactory._id }
        )
            .populate('factoryId')
            .populate('productionLineId');

        return {
            success: true,
            message: 'Plant Admin Machines Fetched',
            result: getmachines
        }
    }


}