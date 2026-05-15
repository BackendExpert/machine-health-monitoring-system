import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document, Types } from 'mongoose';

export type ProductionLineDocument = ProductionLine & Document;

@Schema({ timestamps: true })
export class ProductionLine {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true, max: 10, default: 0})
    max_machines!: number;
    
    @Prop({ type: Types.ObjectId, ref: 'Factory', required: true })
    factoryId!: Types.ObjectId;
}

export const ProductionLineSchema = SchemaFactory.createForClass(ProductionLine);