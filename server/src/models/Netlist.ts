import mongoose, { Document, Schema } from 'mongoose';

export interface IPin {
  id: string;
  name: string;
  type: string;
}

export interface IComponent {
  id: string;
  name: string;
  type: string;
  pins: IPin[];
  x?: number;
  y?: number;
}

export interface IConnectionStatus {
  componentId: string;
  pinId: string;
}

export interface INet {
  id: string;
  name: string;
  connections: IConnectionStatus[];
}

export interface IValidationResult {
  rule: string;
  status: 'pass' | 'fail';
  message: string;
  componentIds?: string[];
  netIds?: string[];
}

export interface INetlist extends Document {
  name: string;
  description?: string;
  user: mongoose.Types.ObjectId;
  components: IComponent[];
  nets: INet[];
  validationResults: IValidationResult[];
  createdAt: Date;
  updatedAt: Date;
}

const PinSchema = new Schema<IPin>({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['input', 'output', 'power', 'ground', 'bidirectional'],
    required: true
  }
});

const ComponentSchema = new Schema<IComponent>({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  pins: [PinSchema],
  x: {
    type: Number
  },
  y: {
    type: Number
  }
});

const ConnectionSchema = new Schema<IConnectionStatus>({
  componentId: {
    type: String,
    required: true
  },
  pinId: {
    type: String,
    required: true
  }
});

const NetSchema = new Schema<INet>({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  connections: [ConnectionSchema]
});

const ValidationResultSchema = new Schema<IValidationResult>({
  rule: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pass', 'fail'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  componentIds: [String],
  netIds: [String]
});

const NetlistSchema = new Schema<INetlist>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  components: [ComponentSchema],
  nets: [NetSchema],
  validationResults: [ValidationResultSchema]
}, {
  timestamps: true
});

export default mongoose.model<INetlist>('Netlist', NetlistSchema);
