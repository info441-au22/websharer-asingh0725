import express, { query } from 'express';
import fetch from 'node-fetch';
import parser from 'node-html-parser';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/urls/preview', function(req, res, next) {
    let queryString = req.query.url;
    fetch(queryString)
        .then(res => res.text())
        .then(value => {
            res.type('html');
            const parsedHTML = parser.parse(value);
            const openGraphURL = parsedHTML.querySelector("meta[property='og:url']");
            const openGraphTitle = parsedHTML.querySelector("meta[property='og:title']");
            const openGraphImage = parsedHTML.querySelector("meta[property='og:image']");
            const openGraphDescription = parsedHTML.querySelector("meta[property='og:description']");
            const openGraphType = parsedHTML.querySelector("meta[property='og:type']");
            let url = openGraphURL == null ? queryString : openGraphURL.getAttribute('content');
            let title = "";
            let image = "";
            let type = "";
            if(openGraphImage != null) {
                image = '<img src='+openGraphImage.getAttribute('content') +'  style="max-height: 200px; max-width: 270px;">';
            }
            let description = openGraphDescription == null ? "" : "<p>" + openGraphDescription.getAttribute('content') + "</p>";
            if(openGraphTitle == null) {
                if(parsedHTML.getElementsByTagName('title')[0] != undefined) {
                    title = parsedHTML.getElementsByTagName('title')[0].innerHTML;
                } else {
                    title = queryString;
                }
            } else {
                title = openGraphTitle.getAttribute('content');
            }
            if(openGraphType != null) {
                type = '<p style="text-decoration: underline;">Content: ' + openGraphType.getAttribute('content') + '</p>';
            }
            const htmlResponse = 
                `<div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;">
                    <a href=${url}>
                        <p><strong>
                            ${title}
                        </strong></p>
                        ${image}
                    </a>
                    ${description}
                    ${type}
                </div>`;
            res.send(htmlResponse);
        });
});

export default router;