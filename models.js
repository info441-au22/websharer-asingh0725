import mongoose, { mongo } from 'mongoose';

let models = {}

main()
async function main(){
    console.log('connecting to mongodb')
    await mongoose.connect('mongodb+srv://websharerUser:websharerUser@cluster0.5qiyggq.mongodb.net/?retryWrites=true&w=majority')

    console.log("successfully connected to mongodb!")

    const postSchema = new mongoose.Schema({
        url: String,
        description: String,
        created_date: Date,
        username: String,
        likes: Array,
    })
    
    const commentSchema = new mongoose.Schema({
        username: String,
        comment: String,
        post: String,
        created_date: Date,
    })

    const userInfo = new mongoose.Schema({
        username: String,
        age: String,
        personal_website: String,
    })
    
    models.Post = mongoose.model('Post', postSchema)
    models.Comment = mongoose.model('Comment', commentSchema)
    models.UserInfo = mongoose.model('UserInfo', userInfo);
    console.log('mongoose models created')
}

export default models