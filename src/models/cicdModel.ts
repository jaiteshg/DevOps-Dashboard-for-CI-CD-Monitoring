import mongoose, { Schema, Document } from "mongoose";

interface ICICD extends Document {
  projectName: string;
  status: string;
  buildNumber: number;
  logs: string;
  createdAt: Date;
}

const CICDSchema = new Schema<ICICD>({
  projectName: { type: String, required: true },
  status: { type: String, enum: ["Success", "Failed", "Pending"], required: true },
  buildNumber: { type: Number, required: true },
  logs: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.CICD || mongoose.model<ICICD>("CICD", CICDSchema);
