import express from 'express';
import session from 'express-session';
var router = express.Router();

router.get('/myIdentity', async (req, res, next) => {
    if (req.session.isAuthenticated) {
        res.json({
            status: "loggedin",
            userInfo: {
                name: req.session.account.name,
                username: req.session.account.username
            }
        })
    } else {
        res.status(401).json({
            "status": "error",
            "error": "not logged in",
        })
      }
});

export default router;