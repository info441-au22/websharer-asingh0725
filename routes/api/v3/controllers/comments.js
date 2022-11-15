import express from 'express';
import session from 'express-session';
var router = express.Router();

router.post('/', async function(req, res, next) {
    if(req.session.isAuthenticated) {
        try{
            const comment = new req.models.Comment({
                username: req.session.account.username,
                comment: req.body.newComment,
                post: req.body.postID,
                created_date: Date(),
            })
            await comment.save();
            res.json({"status": "success"});
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
    try{
        const comments = await req.models.Comment.find({post: req.query.postID});
        res.json(comments)
    } catch(error) {
        console.log(error);
        res.status(500).json({status: "error", error: error});
    }
})
export default router;