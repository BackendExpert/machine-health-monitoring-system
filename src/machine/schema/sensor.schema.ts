import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SensorDataDocument = SensorData & Document;

@Schema({ timestamps: true })
export class SensorData {
    @Prop({ type: Types.ObjectId, ref: 'Machine', required: true, index: true })
    machineId!: Types.ObjectId;

    @Prop({ required: true, min: -50, max: 500 })
    temperature!: number;

    @Prop({ required: true, min: 0 })
    vibration!: number;

    @Prop({ required: true, min: 0 })
    pressure!: number;

    @Prop({ min: 0 })
    rpm!: number;

    @Prop({ min: 0 })
    load!: number;

    @Prop({
        type: [String],
        default: ['normal'],
        enum: [
            'normal',
            'low_temperature',
            'medium_temperature',
            'high_temperature',
            'medium_vibration',
            'high_vibration',
            'low_pressure',
            'medium_pressure',
            'high_pressure',
            'low_rpm',
            'medium_rpm',
            'high_rpm',
            'medium_load',
            'high_load',
        ],
        index: true,
    })
    status!: string[];

    @Prop({
        type: Date,
        default: Date.now,
        index: true,
    })
    recordedAt!: Date;
}

export const SensorDataSchema = SchemaFactory.createForClass(SensorData);