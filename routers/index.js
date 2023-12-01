const
  Uri = require('../models/url'),
  express = require('express'),
  valid = require('valid-url'),
  router = express.Router();

const
  error = async (res, err) => { const urls = await Uri.find({}).sort({ clicks: "desc" }).limit(10); res.render('index', { error: err, urls: urls, post: true }) },
  success = async (res, msg) => { const urls = await Uri.find({}).sort({ clicks: "desc" }).limit(10); res.render('index', { success: msg, urls: urls, post: true }) };

router
  .get('/', async (req, res) => {
    const urls = await Uri.find({}).sort({ clicks: "desc" }).limit(10);
    res.render('index', { urls: urls });
  });

router
  .get('/:id', async (req, res) => {
    const { id } = req.params;

    const data = await Uri.findOne({ short: id });
    if (!data || data == null || (typeof data == Array && !data[0])) res.status(404).render('404');

    await Uri.updateOne({ short: id }, { clicks: data.clicks + 1 });
    res.redirect(data.full);
  });

router
  .post('/', async (req, res) => {
    const { url } = req.body;

    if (req.ip !== process.env.IP) return error(res, "You are not available to short urls");
    if (!url) return error(res, "No url provided");
    if (!valid.isUri(url)) return error(res, "Url is not valid");

    try {
      const data = new Uri({ full: url });
      data.save(async (err) => {
        if (!err) {
          return success(res, "Congratz, you did it!");
        } else {
          if (err.errors.full) {
            // This url is already specified.
            const already = await Uri.find({ full: url });
            return error(res, `This url is already shortened <div>ID: <a href="/${already[0].short}">${already[0].short}</a></div>`);
          } else if (err.errors.short) {
            console.log(err.errors);
            // This short url is already specified.
            return error(res, "This short url is being used. Please try again");
          } else {
            // IDK
            console.log(err);
            return error(res, "Some technical error happened, please contact website owner");
          };
        };
      });
    } catch (e) {
      return error(res, e.message);
    };
  });

module.exports = router;