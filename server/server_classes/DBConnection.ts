import Mongoose from 'mongoose';

export default class DBConnection {

    public static dbConection(){
        const mongooseOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        };
        Mongoose.connect('mongodb://localhost:27017/flujos', mongooseOptions, (err) => {
            if (err) console.log(err);
            console.log('base de datos online');
        });
    }
}