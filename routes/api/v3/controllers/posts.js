import express, { query } from 'express';
import session from 'express-session';
var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/', async function(req, res, next) {
    if (req.session.isAuthenticated) {
        try{
            const post = new req.models.Post({
                url: req.body.url,
                description: req.body.description,
                created_date: Date(),
                content: req.body.type,
                username: req.session.account.username
            })
            await post.save();
            res.json({"status": "success"})
        } catch(error) {
            console.log(error);
            res.status(500).json({status: "error", error: error});
        }
    } else {
        res.status(401).send({
            status: "error",
            error: "not logged in"
         });
    }
    
})

router.post('/like', async function(req, res, next) {
    if(req.session.isAuthenticated) {
        try{
            let likedPost = await req.models.Post.findById(req.body.postID);
            if(!likedPost.likes.includes(req.session.account.username)) {
                likedPost.likes.push(req.session.account.username);
            }
            await likedPost.save();
            res.json({"status": "success"})
        } catch(error) {
            res.status(500).json({
                "status": "error",
                "error": error
            })
        }
    } else {
        res.status(401).json(
            {
                status: "error",
                error: "not logged in"
            }
        )
    }
})

router.post('/unlike', async function(req, res, next) {
    if(req.session.isAuthenticated) {
        try{
            let unlikedPost = await req.models.Post.findById(req.body.postID);
            if(unlikedPost.likes.includes(req.session.account.username)) {
                const index = unlikedPost.likes.indexOf(req.session.account.username);
                if(index > -1) {
                    unlikedPost.likes.splice(index, 1)
                }
            }
            await unlikedPost.save();
            res.json({"status": "success"})
        } catch(error) {
            res.status(500).json({
                "status": "error",
                "error": error
            })
        }
    } else {
        res.status(401).json(
            {
                status: "error",
                error: "not logged in"
            }
        )
    }
})

router.get('/', async function(req, res, next) {
    let posts = await req.models.Post.find();
    if (req.query.username != undefined) {
        posts = await req.models.Post.find({"username": req.query.username});
    }
    let postsArr = [];
    try{
        for(let i = 0; i < posts.length; i++) {
            const postHTML = await getURLPreview(posts[i].url);
            const postID = posts[i]._id;
            const postJSON = {
                id: postID,
                likes: posts[i].likes,
                created_date: posts[i].created_date,
                url: posts[i].url,
                description: posts[i].description,
                username: posts[i].username,
                htmlPreview: postHTML,
            }
            postsArr.push(postJSON);
        }
        
    } catch(error) {
        console.log(error);
        res.status(500).json({status: "error", error: error});
    }
    res.type('json');
    res.send(postsArr);
})

router.delete('/', async function(req, res, next) {
    if(req.session.isAuthenticated) {
        try{
            let likedPost = await req.models.Post.findById(req.body.postID);
            if(likedPost.username != req.session.account.username) {
                res.status(401).json(
                    {
                        status: 'error',
                        error: "you can only delete your own posts"
                    }                     
                )
            } else {
                await req.models.Post.deleteOne({_id: req.body.postID});
                await req.models.Comment.deleteMany({post: req.body.postID})
                res.json({"status": "success"});
            }
        } catch(error) {
            console.log(error);
            res.status(500).json({status: "error", error: error});
        }
    } else {
        res.status(401).json(
            {
                status: "error",
                error: "not logged in"
            }
        )
    }
})
export default router;