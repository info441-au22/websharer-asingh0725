import fetch from 'node-fetch';

import parser from 'node-html-parser';

async function getURLPreview(url){
  const content = fetch(url)
        .then(res => res.text())
        .then(value => {
            const parsedHTML = parser.parse(value);
            const openGraphURL = parsedHTML.querySelector("meta[property='og:url']");
            const openGraphTitle = parsedHTML.querySelector("meta[property='og:title']");
            const openGraphImage = parsedHTML.querySelector("meta[property='og:image']");
            const openGraphDescription = parsedHTML.querySelector("meta[property='og:description']");
            const openGraphType = parsedHTML.querySelector("meta[property='og:type']");
            let url = openGraphURL == null ? url : openGraphURL.getAttribute('content');
            let title = openGraphTitle == null ? 
                        (parsedHTML.getElementsByTagName('title')[0] != undefined ?
                         parsedHTML.getElementsByTagName('title')[0].innerHTML :
                         url) : openGraphTitle.getAttribute('content');
            let image = openGraphImage == null ? 
                        "" : '<img src='+openGraphImage.getAttribute('content') +'  style="max-height: 200px; max-width: 270px;">';
            let type = openGraphType == null ? 
                        "" : '<p style="text-decoration: underline;">Content: ' + openGraphType.getAttribute('content') + '</p>';
            let description = openGraphDescription == null ? "" : "<p>" + openGraphDescription.getAttribute('content') + "</p>";
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
            return htmlResponse;
        }).catch((err) => {
          let htmlContent = 
            `<div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;"> 
            <p><strong> 
                ${err}
            </strong></p>
            </div>`
          return htmlContent
        })
  return content;
}

export default getURLPreview;