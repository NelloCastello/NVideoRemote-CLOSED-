var express = require('express');
var router = express.Router();

const origin = require('../origin/origin');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let search = new origin.Search('Я легенда');
  console.log(await search.load());
  res.render('index', { title: 'NVideoRemote'});
});

router.get('/search', async function(req, res, next) {
  let search = req.query.search;

  res.render('search', { title: 'Поиск', search: search });
});

module.exports = router;
