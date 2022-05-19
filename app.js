(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');
    
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const imgRequest = new XMLHttpRequest();
        imgRequest.onload = addImage;
        imgRequest.onerror = function (err) {
            requestError(err,'image')
        };
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.setRequestHeader('Authorization', 'Client-ID zQyHB5gghuYhR8BEbGnGZ3IGV_6Z096NFe1DbZINCdw');
        imgRequest.send();

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.onerror = function (err) {
            requestError(err,'image')
        };
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=Kw4OJFUoGD9A63W7icfYMC7g37dGULmv`);
        articleRequest.send();

        function addImage(){
            console.log('response expected');
            let htmlContent = '';
            const data = JSON.parse(this.responseText);
            const firstImage = data.results[0];

            if (data && data.results && data.results[0]){
            htmlContent = `<figure>
            <img src='${firstImage.urls.regular}' alt='${searchedForText}'>
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = `<div class="error-no-image">No images available<div>`
        };
        responseContainer.insertAdjacentHTML('afterbegin',htmlContent);

    }
        function addArticles(){
            console.log('article expected')
            let htmlArticleContent ='';
            const data = JSON.parse(this.responseText);

            if(data.response && data.response.docs && data.response.docs.length >1){
                htmlArticleContent = '<ul>'+ data.response.docs.map(article =>`<li class="article">
                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                <p>${article.snippet}</P></li>`).join('')+
                '</ul>';
            } else {
                htmlArticleContent = '<div class="error-no-articles">No Article Availble <div>'
            };
            responseContainer.insertAdjacentHTML('beforeend',htmlArticleContent);
        }
    });
})();