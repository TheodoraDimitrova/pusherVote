const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Vote = require("../models/Vote");

const Pusher = require("pusher");
const keys= require('../config/keys')

let pusher = new Pusher({
  appId: keys.pusherAppId,
  key: keys.pusherKey,
  secret: keys.pusherSecret,
  cluster: keys.pusherCluster,
  useTLS: keys.pusherEncrypted
});

router.get("/", (req, res) => {
  Vote.find().then((votes)=>{
     res.json({
         success:true,
         votes:votes
     })
  })
});

router.post("/", (req, res) => {
  const newVote = {
    sm: req.body.sm,
    points: 1
  };

  new Vote(newVote).save().then(vote => {
    pusher.trigger("sm-vote", "vote", {
      points: parseInt(vote.points),
      sm: vote.sm
    });
  });

  return res.json({
    success: true,
    message: "Thank you for voiting"
  });
});

module.exports = router;
