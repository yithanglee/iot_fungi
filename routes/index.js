var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const he = require('he');
/* GET home page. */
router.get('/*', async function (req, res, next) {
  var contentNav = '', content = '', filename = ''
  console.log(req.params)
  key = req.params[0]

  switch (key) {
    case "home":
      filename = "landing.html"
      break;

    default:
      filename = "landing.html"

  }

  const filePathNav = path.join(__dirname, '../internal/html/', 'blog_nav.html');

  try {
    contentNav = await fs.readFile(filePathNav);
  
  } catch (e) {

  }
  const decodedHtmlNav = he.decode(Buffer.from(contentNav).toString());


  const filePath = path.join(__dirname, '../internal/html/', filename);

  try {
    content = await fs.readFile(filePath);
  
  } catch (e) {

  }
  const decodedHtml = he.decode(Buffer.from(content).toString());


  res.render('index', { title: 'Express', content: decodedHtmlNav + decodedHtml  });
});

module.exports = router;
