import mongoose, {Schema, Document} from "mongoose";

export interface IQuestion extends Document {
    title: String;
    url: String[];
    difficulty: 'Easy'|'Medium'|'Hard';
}

const QuesSchema: Schema = new Schema({
    title: {type: String, required: true},
    url: {type: [String], default: []},
    difficulty: {type: String, enum:['Easy','Medium','Hard'], required: true}
});

export default mongoose.model<IQuestion>('Question', QuesSchema);