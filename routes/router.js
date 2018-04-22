var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Things = require('../data/get_things.js')
//var Thing = require('../models/thing');
//var things_db = require('../database/thing_connect.js');

var thingsData = require('../data/search.js')

// GET route for login
router.get('/', function (req, res, next) {
	return res.sendFile(path.join(__dirname + '/loginTemplate/index.html'));
});


//POST route for login. Check if user is registered
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }
    
    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logusername && req.body.logpassword) {
    User.authenticate(req.body.logusername, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})


// GET route after registering. Go to map
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.render('pages/index');
        }
      }
    });
});


// GET about page
router.get('/about', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.render('pages/about');
        }
      }
    });
});

// GET live map page
router.get('/livemap', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.render('pages/livemap');
        }
      }
    });
});


// GET things page
router.get('/things', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.render('pages/things');
        }
      }
    });
});



/* Get all things and display on a list at '/things' */
router.get('/things/all', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          Things.fetchThings("ggwp").then(s => {
            res.send(s)
          })
        }
      }
    });
});

/* Update thing and display on a list at '/things' */
router.post('/things/update', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          //var params = JSON.parse(req.body)
          Things.updateThing(req.body).then(s => {
            res.send(s)
          })
        }
      }
    });
});



// A new thing will be added to the database
router.post('/things', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          var r = Things.fetchThings().then(s => {
            res.send(s)
          })
        }
      }
    });
});



// GET for logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});




// Elastic search query
router.post('/profile', function (req, res, next) {
	User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
  	} else {
      if (user === null) {
        var err = new Error('Not authorized! Go back!');
        err.status = 400;
        return next(err);
    	} else {
		    var body = req.body
				var r = thingsData.getData(body).then(data => {
				  res.send(data)
				})
		  }
	  }
	})
})


module.exports = router;