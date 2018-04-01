var express = require('express');
var router = express.Router();
var User = require('../models/user');
var things_data = require('../data/search.js')

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
				    var r = things_data.getData().then((data) => {
					    res.send(data)
					    console.log(data)
				    })
			    }
        }
    })
})


module.exports = router;