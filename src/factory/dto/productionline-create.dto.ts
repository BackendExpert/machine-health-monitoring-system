import { IsMongoId, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateProductionLineDto {
    
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @Min(0)
    @Max(10)
    max_machines!: number;

    @IsMongoId()
    factoryId!: string;
}