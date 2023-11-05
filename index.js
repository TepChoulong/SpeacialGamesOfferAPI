const PORT = process.env.PORT || 8080;

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const GameWebsites = [
    {
        name: 'Steam',
        address: 'https://store.steampowered.com/search/?specials=1',
        base: 'https://store.steampowered.com/'
    },
    {
        name: 'GOG',
        address: 'https://www.gog.com/en/games?page=1',
        base: 'https://www.gog.com/en/'
    },
    {
        name: 'GOG',
        address: 'https://www.gog.com/en/games?page=2',
        base: 'https://www.gog.com/en/'
    },
    {
        name: 'GOG',
        address: 'https://www.gog.com/en/games?page=3',
        base: 'https://www.gog.com/en/'
    },
    {
        name: 'GOG',
        address: 'https://www.gog.com/en/games?page=4',
        base: 'https://www.gog.com/en/'
    },
    {
        name: 'GOG',
        address: 'https://www.gog.com/en/games?page=5',
        base: 'https://www.gog.com/en/'
    },
    {
        name: 'EpicGame',
        address: 'https://store.epicgames.com/en-US/browse?sortBy=releaseDate&sortDir=DESC&priceTier=tierDiscouted&category=Game&count=40&start=0',
        base: 'https://store.epicgames.com/en-US/'
    }
]

// .sc-dkQUaI

let All_Games = [];
const EpicGames_List = [];
const GOG_Games = [];
const Steam_Games = [];

GameWebsites.forEach(gameWebsites => {
    axios.get(gameWebsites.address)
        .then((response) => {

            const html = response.data;
            const $ = cheerio.load(html);

            // Steam
            $('#search_resultsRows a', html).each(function () { // Won't work on arrow function

                const title = $(this).find('.title').text();
                const original_prices = $(this).find('.discount_original_price').text();
                const discount_prices = $(this).find('.discount_final_price').text();
                const discount_percentage = $(this).find('.discount_pct').text();
                const url = $(this).attr('href');

                Steam_Games.push({
                    title,
                    original_prices,
                    discount_prices,
                    discount_percentage,
                    url
                })

            })

            // GOG
            $('product-tile', html).each(function() {

                const title = $(this).find('.small').find('span').text();
                const base_prices = $(this).find('.ng-star-inserted').find('.base-value').text();
                const final_prices = $(this).find('.ng-star-inserted').find('.final-value').text();
                const discount_percentage = $(this).find('price-discount').text();

                GOG_Games.push({
                    title,
                    base_prices,
                    final_prices,
                    discount_percentage
                })
            })

            // EpicGame
            $('.css-lrwy1y', html).each(function() {

                const title = $(this).find('.css-rgqwpc').text();

                EpicGames_List.push({
                    title
                })
            })

        })
        .catch((err) => {

            console.log("ERROR: " + err);
        });
})



app.get('/steam-special-discount-games', (req, res) => {
    res.json(Steam_Games);
})

app.get('/gog-special-discount-games', (req, res) => {
    res.json(GOG_Games);
})

app.get('/epicgame-special-discount-games', (req, res) => {
    res.json(EpicGames_List);
})


// WELCOME ROUTE
app.get('/', (req, res) => {
    All_Games = [Steam_Games, GOG_Games];

    res.json(All_Games);
})


app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));