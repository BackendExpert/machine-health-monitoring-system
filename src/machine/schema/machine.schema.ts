import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MachineDocument = Machine & Document;

@Schema({ timestamps: true })
export class Machine {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    type!: string;

    @Prop()
    model!: string;

    @Prop()
    serialNumber!: string;

    @Prop({ default: 'active', enum: ['active', 'inactive', 'maintenance', 'failed'] })
    status!: string;

    @Prop({ type: Types.ObjectId, ref: 'Factory', required: true })
    factoryId!: Types.ObjectId;
    
    @Prop({ type: Types.ObjectId, ref: 'ProductionLine', required: true })
    productionLineId!: Types.ObjectId;

    @Prop({ default: 100 })
    healthScore!: number;

    @Prop({ default: 'good', enum: ['good', 'warning', 'need_action']})
    healthStatus!: string;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);