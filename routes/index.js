var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const he = require('he');
/* GET home page. */
router.get('/*', async function (req, res, next) {
  var content = '', filename = ''
  console.log(req.params)
  key = req.params[0]

  switch (key) {
    case "home":
      filename = "landing.html"
      break;

    default:
      filename = ''

  }
  const filePath = path.join(__dirname, '../public/html/v2', filename);
  console.log(filePath)
  try {
    content = await fs.readFile(filePath);
  
  } catch (e) {

  }
  console.log(Buffer.from(content).toString())
  const decodedHtml = he.decode(Buffer.from(content).toString());
  res.render('index', { title: 'Express', content: decodedHtml  });
});

module.exports = router;
