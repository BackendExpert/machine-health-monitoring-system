import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FactoryDocument = Factory & Document;

@Schema({ _id: false })
class Location {

    @Prop()
    location_id!: string;

    @Prop()
    name!: string;

    @Prop()
    region!: string;

    @Prop()
    type!: string;
}

@Schema({ timestamps: true })
export class Factory {
    @Prop({ required: true })
    name!: string;

    @Prop({ type: Location })
    location!: Location;

    @Prop()
    description!: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    plant_admin!: Types.ObjectId;
}

export const FactorySchema = SchemaFactory.createForClass(Factory);