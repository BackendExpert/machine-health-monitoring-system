import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SensorDataDocument = SensorData & Document;

@Schema({ _id: false })
class Sensor {

    @Prop({ required: true, min: 0 })
    mid!: number;

    @Prop({ type: Types.ObjectId, ref: 'Machine', required: true, index: true })
    machineId!: Types.ObjectId;

    @Prop({ required: true, min: -50, max: 500 })
    temperature!: number;

    @Prop({ required: true, min: 0 })
    vibration!: number;

    @Prop({ required: true, min: 0 })
    pressure!: number;

    @Prop({ required: true, min: 0 })
    rpm!: number;

    @Prop({ required: true, min: 0 })
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
    })
    status!: string[];

    @Prop({ required: true, index: true })
    dayOfWeek!: number;

    @Prop({ required: true, index: true })
    hourOfDay!: number;

    @Prop({ required: true })
    minuteOfHour!: number;

    @Prop({ required: true, default: 0 })
    penalty!: number;

    @Prop({
        type: Date,
        required: true,
        index: true,
    })
    recordedAt!: Date;
}

const SensorSchema = SchemaFactory.createForClass(Sensor);

@Schema({ timestamps: true })
export class SensorData {

    @Prop({ required: true })
    timestamp!: Date;

    @Prop({ type: [SensorSchema], default: [] })
    sensor_data!: Sensor[];
}

export const SensorDataSchema = SchemaFactory.createForClass(SensorData);