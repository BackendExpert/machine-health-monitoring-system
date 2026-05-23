import { IsString } from "class-validator";

export class MachineCreateDto {
    @IsString()
    name!: string;

    @IsString()
    type!: string;

    @IsString()
    model!: string;

    @IsString()
    serialNumber!: string;

    @IsString()
    factoryId!: string;

    @IsString()
    productionLineId!: string;
}