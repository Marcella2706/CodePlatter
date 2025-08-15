import mongoose, { Document } from "mongoose";
export interface IQuestion extends Document {
    title: String;
    url: String[];
    difficulty: 'Easy' | 'Medium' | 'Hard';
}
declare const _default: mongoose.Model<IQuestion, {}, {}, {}, mongoose.Document<unknown, {}, IQuestion, {}, {}> & IQuestion & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Question.d.ts.map