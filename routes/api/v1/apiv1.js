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
            //Set the type to HTML.
            res.type('html');
            //Parse response's value to get the html.
            const parsedHTML = parser.parse(value);
            /*
                ** Creating variables for the url, title, image, desc, and type from open
                ** graph meta tags.
            */
            const openGraphURL = parsedHTML.querySelector("meta[property='og:url']");
            const openGraphTitle = parsedHTML.querySelector("meta[property='og:title']");
            const openGraphImage = parsedHTML.querySelector("meta[property='og:image']");
            const openGraphDescription = parsedHTML.querySelector("meta[property='og:description']");
            const openGraphType = parsedHTML.querySelector("meta[property='og:type']");

            //Setting up values for the preview features and creating HTML elements
            let url = openGraphURL == null ? queryString : openGraphURL.getAttribute('content');
            let title = openGraphTitle == null ? 
                        (parsedHTML.getElementsByTagName('title')[0] != undefined ?
                         parsedHTML.getElementsByTagName('title')[0].innerHTML :
                         queryString) : openGraphTitle.getAttribute('content');
            let image = openGraphImage == null ? 
                        "" : '<img src='+openGraphImage.getAttribute('content') +'  style="max-height: 200px; max-width: 270px;">';
            let type = openGraphType == null ? 
                        "" : '<p style="text-decoration: underline;">Content: ' + openGraphType.getAttribute('content') + '</p>';
            let description = openGraphDescription == null ? "" : "<p>" + openGraphDescription.getAttribute('content') + "</p>";

            //The HTML response that the API sends
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