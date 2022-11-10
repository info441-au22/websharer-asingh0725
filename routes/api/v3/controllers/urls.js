import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.get('/preview', async function(req, res, next) {
    let url = req.query.url;
    let content = await getURLPreview(url);
    res.type('html');
    res.send(content);
})

export default router;