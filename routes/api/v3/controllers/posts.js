import express from 'express';
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
                username: req.body.username
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

router.get('/', async function(req, res, next) {
    let posts = await req.models.Post.find();
    if (req.query.username != undefined) {
        posts = await req.models.Post.find(
            {
                "username": req.query.username,
            }
        );
    }
    let htmlDescArr = [];
    try{
        for(let i = 0; i < posts.length; i++) {
            const postHTML = await getURLPreview(posts[i].url);
            const postJSON = {
                username: posts[i].username,
                description: posts[i].description,
                htmlPreview: postHTML,
            }
            htmlDescArr.push(postJSON);
        }
        
    } catch(error) {
        console.log(error);
        res.status(500).json({status: "error", error: error});
    }
    res.type('json');
    res.send(htmlDescArr);
})

export default router;