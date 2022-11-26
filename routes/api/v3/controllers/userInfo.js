import express from 'express';

var router = express.Router();

router.post('/', async function(req, res, next) {
    if (req.session.isAuthenticated) {
        try{
            const userInfo = new req.models.UserInfo({
                username: req.session.account.username,
                age: req.body.age,
                personal_website: req.body.personal_website,
            })
            await userInfo.save();
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
    let usersInfo = await req.models.UserInfo.find();
    let username = req.query.username;
    let usersInfoArray = [];
    try{
        for (let i = 0; i < usersInfo.length; i++) {
            if (username === usersInfo[i].username) {
                const postJSON = {
                    username: username,
                    age: usersInfo[i].age,
                    personal_website: usersInfo[i].personal_website,
                }
                usersInfoArray.push(postJSON);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error });
    }
    res.type('json');
    res.send(usersInfoArray);
})

export default router;