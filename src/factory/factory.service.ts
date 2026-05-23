import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";
import { User, UserDocument } from "src/user/schema/user.schema";
import { Factory, FactoryDocument } from "./schema/factory.schema";
import { ProductionLine, ProductionLineDocument } from "./schema/productionline .schema";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "src/common/utils/email.util";
import { Role, RoleDocument } from "src/role/schema/role.schema";
import { FactoryCreateDto } from "./dto/factory-create.dto";
import { CreateProductionLineDto } from "./dto/productionline-create.dto";
import { createAuditLog } from "src/common/utils/auditlogs.util";
import { Types } from 'mongoose';

@Injectable()
export class FactoryService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        @InjectModel(Role.name)
        private readonly roleModel: Model<RoleDocument>,

        @InjectModel(AuditLog.name)
        private readonly auditlogModel: Model<AuditLogDocument>,

        @InjectModel(Factory.name)
        private readonly factoryModel: Model<FactoryDocument>,

        @InjectModel(ProductionLine.name)
        private readonly productionlineModel: Model<ProductionLineDocument>,



        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async FetchPlantAdmins(token: string) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.email })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const platadmin = await this.roleModel.findOne({ role: "plant_admin" })

        if (!platadmin) {
            throw new NotFoundException("Plant Admin Not Found")
        }

        const getusers = await this.userModel.find({ role: platadmin._id })

        return {
            success: true,
            message: "Plant Admin Fetch Success",
            result: getusers
        }
    }

    async CreateFactory(
        body: FactoryCreateDto,
        token: string,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.email })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const plantadmincheck = await this.userModel.findById(body.plant_admin)

        if (!plantadmincheck) {
            throw new ConflictException("Process cannot be continue")
        }

        const checkfactory = await this.factoryModel.findOne({
            name: body.name
        })

        if(checkfactory) {
            throw new ConflictException("Factory Already Create")
        }

        const FactoryCreate = await this.factoryModel.create({
            name: body.name,
            location: body.location,
            description: body.description,
            plant_admin: new Types.ObjectId(body.plant_admin),
        })

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "FACTORY_CREATED_SUCCESS",
            description: `Factory Created Success by ${user.email}`,
            ipAddress,
            userAgent,
            metadata: {
                ipAddress,
                userAgent,
            },
        });

        return {
            success: true,
            message: "Factory Created Successful...,"
        }
    }

    async factoryDelete(
        token: string,
        id: string,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.email })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const deletefactory = await this.factoryModel.findByIdAndDelete(id)

        if (deletefactory) {
            throw new NotFoundException("Factory Not Found...")
        }

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "FACTORY_DELETED_SUCCESS",
            description: `Factory Deleted success ${user.email}`,
            ipAddress,
            userAgent,
            metadata: {
                ipAddress,
                userAgent,
                location,
            },
        });

        return {
            success: true,
            message: "Factory Deleted Success"
        }
    }

    async CreateProductionLine(
        token: string,
        body: CreateProductionLineDto,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.email })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const checkfid = await this.factoryModel.findById(body.factoryId)

        if (!checkfid) {
            throw new NotFoundException("Given Factory Cannot Find")
        }

        const createPL = await this.productionlineModel.create({
            name: body.name,
            max_machines: body.max_machines,
            factoryId: body.factoryId
        })

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "PRODUCTION_LINE_CREATED",
            description: `Production Line Created Success ${user.email}`,
            ipAddress,
            userAgent,
            metadata: {
                ipAddress,
                userAgent,
                location,
            },
        });

        return {
            success: true,
            message: "Production Line Created Success"
        }
    }

    async FetchFactories(
        token: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.email })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const fetchfactories = await this.factoryModel.find()

        return {
            success: true,
            message: "All Factories Fetched Success"
        }
    }

    async FetchFactoryByID(
        token: string,
        id: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.email })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const getfactory = await this.factoryModel.findById(id)

        if (!getfactory) {
            throw new NotFoundException("The Factory Not Found")
        }

        return {
            success: true,
            message: "Factory Data Fetched Success"
        }
    }

    async getProductionlinbyFid(
        token: string,
        id: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.email })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const fetchpls = await this.productionlineModel.find({ factoryId: id })

        if(fetchpls.length === 0) {
            throw new ConflictException("There are no Production Lines at Factory")
        }

        return {
            success: true,
            message: "Production Lines Fetched Succes"
        }
       
    }

    
}