const express = require('express');
const router = express.Router();

router.route("/").get(function(req, res, next) {
  res.status(200).json({
    text: "hello from server 1!"
  });
});

module.exports = router;