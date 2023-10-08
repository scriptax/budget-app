const express = require("express");
const router = express.Router();

router.route("/test/testing").post(function (req, res, next) {
  res.cookie("TEST_COOKIE", "SET-my-cookie-please-please", {
    // httpOnly: true,
    // secure: true,
    // sameSite: 'None',
    // expires: new Date(Date.now() + 3600000),
  });
  res.status(200).json({
    
    text: "hello from server 1!",
  });
});

module.exports = router;
