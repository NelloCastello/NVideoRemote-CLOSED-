const axios = require('axios').default;
const cheerio = require('cheerio').default;



async function load(qValue) {
    const URL = "https://rezka.ag/search";
    let $;

    let response = await axios.get(URL, {
        params: {
            do: 'search',
            subaction: 'search',
            q: qValue
        }
    });

    $ = cheerio.load(response.data);

    return $;
}

class Search {
    constructor(qValue) {
        this.qValue = qValue;
        this.$;
        this.URL = "https://rezka.ag/search";
        this.response;
        this.data = [];
    }

    async load() {
        this.response = await axios.get(this.URL, {
            params: {
                do: 'search',
                subaction: 'search',
                q: this.qValue
            }
        });

        this.$ = cheerio.load(this.response.data);

        this.$('.b-content__inline_item').each((i, el) => {
            let title, link, image;

            title = this.$(el).find('.b-content__inline_item-link a').text();
            link = this.$(el).find('.b-content__inline_item-link a').attr('href');
            image = this.$(el).find('.b-content__inline_item-cover a img').attr('src');

            this.data.push({
                title: title,
                link: link,
                image: image
            })
        })

        return this.data;
    }
}

module.exports = Search;