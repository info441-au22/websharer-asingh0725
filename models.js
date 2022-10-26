import mongoose from 'mongoose';

let models = {}

main()
async function main(){
    console.log('connecting to mongodb')
    await mongoose.connect('mongodb+srv://websharerUser:websharerUser@cluster0.5qiyggq.mongodb.net/?retryWrites=true&w=majority')

    console.log("successfully connected to mongodb!")

    const postSchema = new mongoose.Schema({
        url: String,
        description: String,
        created_date: String,
        username: String,
        content: String,
    })
    
    models.Post = mongoose.model('Post', postSchema)
    console.log('mongoose models created')
}

export default models