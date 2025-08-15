import mongoose, {Schema, Document} from "mongoose";
export interface IUser extends Document {
    name: String;
    email: String;
    password: String;
}

const UserSchema: Schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

export default mongoose.model<IUser>("User", UserSchema);