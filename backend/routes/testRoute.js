const express = require("express");
const router = express.Router();

router.route("/").get(function (req, res, next) {
  res.cookie("TEST_COOKIE", "SET-my-cookie", {
    // httpOnly: true,
    // sameSite: 'Lax',
    // expires: new Date(Date.now() + 3600000),
  });
  res.status(200).json({
    
    text: "hello from server 1!",
  });
});

module.exports = router;
