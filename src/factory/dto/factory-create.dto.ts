import {
    IsString,
    IsNotEmpty,
    IsMongoId,
    IsNumber,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
    @IsString()
    @IsNotEmpty()
    location_id!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    region!: string;

    @IsString()
    @IsNotEmpty()
    type!: string;

    @IsNumber()
    lat!: number;

    @IsNumber()
    lng!: number;

    @IsString()
    @IsNotEmpty()
    address!: string;
}

export class FactoryCreateDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ValidateNested()
    @Type(() => LocationDto)
    location!: LocationDto;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsMongoId()
    plant_admin!: string;
}