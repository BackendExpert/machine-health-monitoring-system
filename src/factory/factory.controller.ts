import { Body, Controller, Delete, Get, Headers, Param, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { FactoryService } from "./factory.service";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";
import { Permissions } from "src/common/decorators/permissions.decorator";
import { FactoryCreateDto } from "./dto/factory-create.dto";
import { ClientInfoDecorator } from "src/common/decorators/client-info.decorator";
import type { ClientInfo } from "src/common/interfaces/client-info.interface";
import { CreateProductionLineDto } from "./dto/productionline-create.dto";

@Controller('api/factory')
export class FactoryController {
    constructor(
        private readonly factoryService: FactoryService
    ) { }

    @Get('/plant-admins')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('factory:fetch-plant-admin')

    fetchPlantAdmin(
        @Body() body: FactoryCreateDto,
        @Headers("authorization") authHeader: string,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.factoryService.FetchPlantAdmins(
            token
        )
    }

    @Post('/create-factory')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('factory:create')

    CreateFactory(
        @Body() body: FactoryCreateDto,
        @Headers("authorization") authHeader: string,
        @ClientInfoDecorator() client: ClientInfo
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.factoryService.CreateFactory(
            body,
            token,
            client.ipAddress,
            client.userAgent
        )
    }

    @Delete('factory-delete')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('factory:delete')

    deleteFactory(
        @Param('id') id: string,
        @Body() body: FactoryCreateDto,
        @Headers("authorization") authHeader: string,
        @ClientInfoDecorator() client: ClientInfo
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.factoryService.factoryDelete(token, id)
    }

    @Post('create-producation-line')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('factory:create-producation-line')

    CreateProductionLine(
        @Body() body: CreateProductionLineDto,
        @Headers("authorization") authHeader: string,
        @ClientInfoDecorator() client: ClientInfo
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.factoryService.CreateProductionLine(
            token,
            body,
            client.ipAddress,
            client.userAgent
        )
    }

    @Get('factories')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('factory:fetch')

    FetchFactoies(
        @Headers("authorization") authHeader: string,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.factoryService.FetchFactories(token)

    }


    @Get('factory/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('factory:fetch-id')

    FetchFactoryBtID(
        @Headers("authorization") authHeader: string,
        @Param('id') id: string,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.factoryService.FetchFactoryByID(token, id)

    }


    @Get("production-line/:id")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('factory:fetch-production-lines')

    FetchProductionLineByFid(
        @Headers("authorization") authHeader: string,
        @Param('id') id: string,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.factoryService.getProductionlinbyFid(token, id)

    }


}