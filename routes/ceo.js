const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

// Load input validation
const validateCEORegistration = require("../validation/ceoreg");
const validateCEOLogin = require("../validation/ceologin");

// Load User model
const CEO = require("../models/ceo");
const Notification = require("../models/notifications");
const ProjectAnalysis = require("../models/projectanalysis");
const BidStatus = require("../models/bidstatus");

// @route POST /adminregisteration
// @desc Register user
// @access Public
router.post("/ceoreg", (req, res) => {
  // Form validation
  const { errors, isValid } = validateCEORegistration(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  CEO.findOne({ ID: req.body.ID }).then(ceo => {
    console.log(ceo);
    if (ceo) {
      return res.status(400).json({ ID: "ID already exists" });
    } else {
      const newCEO = new CEO({
        FullName: req.body.FullName,
        OfficeID: req.body.OfficeID,
        ID: req.body.ID,
        Key: req.body.Key
      });
      // Hash key before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        console.log(req.body.Key);

        bcrypt.hash(newCEO.Key, salt, (err, hash) => {
          console.log(err);
          console.log(req.body.Key);

          if (err) throw err;
          newCEO.Key = hash;
          newCEO
            .save()
            .then(ceo => res.json(newCEO))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST /adminlogin
// @desc Login admin and return JWT token
// @access Public
router.post("/ceologin", (req, res) => {
  // Form validation
  const { errors, isValid } = validateCEOLogin(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const ID = req.body.ID;
  const Key = req.body.Key;
  // Find admin by id
  CEO.findOne({ ID: req.body.ID }).then(ceo => {
    // Check if admin exists
    if (!ceo) {
      return res.status(404).json({ IDNotFound: "ID not found" });
    }
    // Check password
    bcrypt.compare(Key, ceo.Key).then(isMatch => {
      if (isMatch) {
        // Admin matched
        // Create JWT Payload
        const payload = {
          id: ceo.id,
          ID: ceo.ID
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ passwordincorrect: "Key incorrect" });
      }
    });
  });
});

router.post("/getceo", (req, res) => {
  const ID = req.body.ID;
  console.log(ID);

  CEO.findOne({ ID: req.body.ID }).then(user => {
    if (!user) {
      return res.status(404).json({ IDNotFound: "ID not found" });
    }
    return res.json(user);
  });
});

router.post("/getcnotifications", (req, res) => {
  Notification.find()
    .then(noti => {
      if (noti) {
        return res.json(noti);
      } else {
        return res.json({
          ID: "None",
          ProjectName: "None",
          CompanyName: "None",
          Content: "None"
        });
      }
    })
    .catch(err => {
      res.json({ message: "Error" });
    });
});

router.post("/getanalysisdata", (req, res) => {
  ProjectAnalysis.find()
    .then(noti => {
      if (noti) {
        return res.json(noti);
      } else {
        return res.json({
          ID: "None",
          ProjectName: "None",
          CompanyName: "None",
          Suggestions: "None",
          Cost: "None",
          Budget: "None",
          RistFactor: "None",
          Action: "None"
        });
      }
    })
    .catch(err => {
      res.json({ message: "Error" });
    });
});

router.post("/getadata", (req, res) => {
  ProjectAnalysis.findOne({ _id: req.body._id })
    .then(noti => {
      if (noti) {
        return res.json(noti);
      } else {
        return res.json({
          ID: "None",
          ProjectName: "None",
          CompanyName: "None",
          Suggestions: "None",
          Cost: "None",
          Budget: "None",
          RistFactor: "None",
          Action: "None"
        });
      }
    })
    .catch(err => {
      res.json({ message: "Error" });
    });
});

router.post("/updatebidstatus", (req, res) => {
  new BidStatus({
    ID: req.body.ID,
    ProjectName: req.body.ProjectName,
    CompanyName: req.body.CompanyName,
    Bid: req.body.Bid,
    Reason: req.body.Reason,
    Status: req.body.Status
  })
    .save()
    .then(r => {
      res.json({ message: "Done" });
    })
    .catch(err => {
      res.json({ message: "Error" });
    });
});

module.exports = router;
