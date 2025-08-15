import mongoose, { Document } from "mongoose";
export interface ICategory extends Document {
    title: String;
    questions: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}, {}> & ICategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Category.d.ts.map