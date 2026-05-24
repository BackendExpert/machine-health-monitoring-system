import { Body, Controller, Get, Headers, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { MachineService } from "./machine.service";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";
import { Permissions } from "src/common/decorators/permissions.decorator";
import { MachineCreateDto } from "./dto/machine-create.dto";
import { ClientInfoDecorator } from "src/common/decorators/client-info.decorator";
import type { ClientInfo } from "src/common/interfaces/client-info.interface";


@Controller('api/machine')
export class MachineController {
    constructor(
        private readonly machineService: MachineService
    ) { }

    @Post('create-machine')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('machine:create')

    CreateMachine(
        @Body() dto: MachineCreateDto,
        @Headers("authorization") authHeader: string,
        @ClientInfoDecorator() client: ClientInfo,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.machineService.CreateMachine(
            token,
            dto,
            client.ipAddress,
            client.userAgent
        )
    }

    @Get('fetch-machines')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('machine:fetch-all')

    FetchAllMachine(
        @Headers("authorization") authHeader: string,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.machineService.FetchAllMachines(token)
    }

    @Get('fetch-plant-machines')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('machine:fetch-all')

    FetchPlantAdminMachines(
        @Headers("authorization") authHeader: string,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.machineService.FetchPlantAdminMachine(token)

    }

}