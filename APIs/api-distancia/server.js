const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const puppeteer = require("puppeteer");

app.use(bodyParser.json());
app.use(cors());

app.listen("7070");

app.post("/", (req, res) => {
  async function scrape(destino) {
    const browser = await puppeteer.launch({
      headless: true,
    });

    let seletor = `#pane .section-directions-trip-description .section-directions-trip-distance`;

    link = `https://www.google.com/maps/dir/04338000+alvares+fagundes+466/${destino}?hl=en`;

    const page = await browser.newPage();
    await page.goto(link);
    const urls = await page.$eval(seletor, (el) => {
      return el.innerText;
    });

    browser.close();
    return urls;
  }
  try {
    if (req.body.query) {
      scrape(req.body.query).then((r) => {
        res.send({ distancia: r });
      });
    } 
  } catch (err) {
    res.send({ distancia: err.message });
  }
});
