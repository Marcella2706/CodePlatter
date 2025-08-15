import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    name: String;
    email: String;
    password: String;
    bookmarks: mongoose.Types.ObjectId[];
    progress: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map