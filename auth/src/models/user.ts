import mongoose from "mongoose";
import { Password } from "../services/password";

//interface to define properties required to create a 
//new User
interface UserAttrs {
    email: string;
    password: string;
}
//interface to define the properties that a User Model has:
interface UserModel extends mongoose.Model<UserDoc> {
    build(attr: UserAttrs): UserDoc;
}
//interface to define the properties that a User Document has:
interface UserDoc extends mongoose.Document{
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        //formatting JSON properties, so when we send back user object, we dont include unnecessary properties like password, _v, and turn _id property to id
        toJSON: {
          transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
          },
        },
    }
);

//pre is a middleware function, that, upon 'saving' i.e. persisting
// the user object, does smth specified
// in the async callback function
userSchema.pre('save', async function(done) {
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export {User};