var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const he = require('he');
const axios = require('axios');
require('dotenv').config();
const blogUrl = process.env.BLOG_URL;


async function api(url) {
  try {
    const apiUrl = url; // Replace with the actual API URL
    const response = await axios.get(apiUrl);
    // You can handle the response data here and send it back to the client
    return JSON.stringify(response.data)
  } catch (error) {
    console.error('Error calling external API:', error);

  }

}

/* GET home page. */
router.get('/*', async function (req, res, next) {
  console.log(`Subdomain is: ${req.subdomain}`)
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
  let outlet = null
  let items = null
  console.log(req.query.location == null)
  console.log(req.query.location)
  if (req.query.location) {
  outlet = await api(blogUrl + "/api/webhook?scope=get_outlet&code=" + req.query.location)
  items = await api(blogUrl + "/api/webhook?scope=get_items&code=" + req.query.location)

  }
  res.render('index', { outlet: outlet, title: req.query.location, content: decodedHtmlNav + decodedHtml, items: items });
});

module.exports = router;
