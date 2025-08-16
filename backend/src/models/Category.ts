import mongoose, {Schema, Document} from "mongoose";

export interface ICategory extends Document {
    title: String;
    questions: mongoose.Types.ObjectId[];
}

const CatSchema: Schema = new Schema({
    title: {type: String, required: true},
    questions: [{type: Schema.Types.ObjectId, ref: 'Question'}]
}, {
    timestamps: true
});

export default mongoose.model<ICategory>("Category", CatSchema);