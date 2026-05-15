import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MaintenanceDocument = Maintenance & Document;

@Schema({ timestamps: true })
export class Maintenance {
    @Prop({ type: Types.ObjectId, ref: 'Machine', required: true })
    machineId!: Types.ObjectId;

    @Prop()
    issue!: string;

    @Prop({ default: 'pending', enum: ['pending', 'in-progress', 'completed'] })
    status!: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    assignedTo!: Types.ObjectId;

    @Prop()
    completedAt!: Date;

    @Prop()
    downtimeHours!: number;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);