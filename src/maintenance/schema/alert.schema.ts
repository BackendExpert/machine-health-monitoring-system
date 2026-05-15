import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AlertDocument = Alert & Document;

@Schema({ timestamps: true })
export class Alert {
    @Prop({ type: Types.ObjectId, ref: 'Machine', required: true })
    machineId!: Types.ObjectId;

    @Prop({
        required: true, enum: [
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
    type!: string;

    @Prop({ required: true, enum: ['low', 'medium', 'critical'] })
    severity!: string;

    @Prop()
    message!: string;

    @Prop({ default: false })
    resolved!: boolean;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);