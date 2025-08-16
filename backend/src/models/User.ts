import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    name: String;
    email: String;
    password: String;
    bookmarks: mongoose.Types.ObjectId[];
    progress: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    bookmarks: [{type: Schema.Types.ObjectId, ref:'Question'}],
    progress: [{type: Schema.Types.ObjectId, ref:'Question'}]
}, {
    timestamps: true 
});

export default mongoose.model<IUser>("User", UserSchema);