var express = require('express');
var router = express.Router();
var moment = require('moment');
var jwt = require('jwt-simple');
var request = require('request');
var qs = require('querystring');

// additions
var path = require('path');
var cors = require('cors');
var request = require('request');

var config = require('../../_config');
var User = require('../models/user.js');


// *** login required *** //
function ensureAuthenticated(req, res, next) {
    if (!(req.headers && req.headers.authorization)) {
        return res.status(400).send({
            message: 'You did not provide a JSON Web Token in the authorization header.'
        });
    }

    // decode the token
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    var payload = jwt.decode(token, config.TOKEN_SECRET);
    var now = moment().unix();

    // check if the token has expired
    if (now > payload.exp) {
        return res.status(401).send({
            message: 'Token has expired. '
        });
    }

    // check if the user still exists in the db
    User.findById(payload.sub, function (err, user) {
        if (!user) {
            return res.status(400).send({
                message: 'User no longer exists. '
            });
        }
        req.user = user;
        next();
    });
}

// *** generate token *** //
function createToken(user) {
    var payload = {
        exp: moment().add(14, 'days').unix(),
        iat: moment().unix(),
        sub: user._id
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

// *** register route (email and password) *** //
router.post('/signup', function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, existingUser) {
        if (existingUser) {
            return res.status(409).send({
                message: 'Email is already taken'
            });
        }
        var user = new User({
            email: req.body.email,
            password: req.body.password
        });
        user.save(function () {
            var token = createToken(user);
            res.send({
                token: token,
                user: user
            });
        });
    });
});

// *** login route (email and password) *** //
router.post('/login', function (req, res) {
    User.findOne({
        email: req.body.email
    }, '+password', function (err, user) {
        if (!user) {
            return res.status(401).send({
                message: {
                    email: 'Incorrect email'
                }
            });
        }
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({
                    message: 'Wrong email address and/or password'
                });
            }
            user = user.toObject();
            delete user.password;
            var token = createToken(user);
            res.send({
                token: token,
                user: user
            });
        });
    });
});

// *** update user route *** //
router.put('/update', ensureAuthenticated, function (req, res) {
    User.findOne({
        _id: req.body._id
    }, function (err, user) {
        if (!user) {
            return res.status(401).send({
                message: {
                    email: 'Incorrect email'
                }
            });
        }
        user.email = req.body.email;
        user.save(function () {
            res.send(user);
        });
    });
});

// *** github auth *** //
router.post('/github', function (req, res) {
    var accessTokenUrl = 'https://github.com/login/oauth/access_token';
    var userApiUrl = 'https://api.github.com/user';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: config.GITHUB_SECRET
    };

    // Step 1. Exchange authorization code for access token.
    request.get({
        url: accessTokenUrl,
        qs: params
    }, function (err, response, accessToken) {
        accessToken = qs.parse(accessToken);
        var headers = {
            'User-Agent': 'Satellizer'
        };

        // Step 2. Retrieve profile information about the current user.
        request.get({
            url: userApiUrl,
            qs: accessToken,
            headers: headers,
            json: true
        }, function (err, response, profile) {
            // Step 3a. Link user accounts.
            if (req.headers.authorization) {
                User.findOne({
                    github: profile.id
                }, function (err, existingUser) {
                    if (existingUser) {
                        return res.status(409).send({
                            message: 'There is already a GitHub account that belongs to you'
                        });
                    }
                    var token = req.headers.authorization.split(' ')[1];
                    var payload = jwt.decode(token, config.TOKEN_SECRET);
                    User.findById(payload.sub, function (err, user) {
                        if (!user) {
                            return res.status(400).send({
                                message: 'User not found'
                            });
                        }
                        user.email = profile.email;
                        user.githubProfileID = profile.id;
                        user.save(function () {
                            var token = createToken(user);
                            res.send({
                                token: token,
                                user: user
                            });
                        });
                    });
                });
            } else {
                // Step 3b. Create a new user account or return an existing one.
                User.findOne({
                    githubProfileID: profile.id
                }, function (err, existingUser) {
                    if (existingUser) {
                        var token = createToken(existingUser);
                        return res.send({
                            token: token,
                            user: existingUser
                        });
                    }
                    var user = new User();
                    user.email = profile.email;
                    user.githubProfileID = profile.id;
                    user.save(function () {
                        var token = createToken(user);
                        res.send({
                            token: token,
                            user: user
                        });
                    });
                });
            }
        });
    });
});

// *** google auth *** //
router.post('/google', function (req, res) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.GOOGLE_SECRET,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };

    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, {
        json: true,
        form: params
    }, function (err, response, token) {
        var accessToken = token.access_token;
        var headers = {
            Authorization: 'Bearer ' + accessToken
        };

        // Step 2. Retrieve profile information about the current user.
        request.get({
            url: peopleApiUrl,
            headers: headers,
            json: true
        }, function (err, response, profile) {
            if (profile.error) {
                return res.status(500).send({
                    message: profile.error.message
                });
            }
            // Step 3a. Link user accounts.
            if (req.headers.authorization) {
                User.findOne({
                    googleProfileID: profile.sub
                }, function (err, existingUser) {
                    if (existingUser) {
                        return res.status(409).send({
                            message: 'There is already a Google account that belongs to you'
                        });
                    }
                    var token = req.headers.authorization.split(' ')[1];
                    var payload = jwt.decode(token, config.TOKEN_SECRET);
                    User.findById(payload.sub, function (err, user) {
                        if (!user) {
                            return res.status(400).send({
                                message: 'User not found'
                            });
                        }
                        user.googleProfileID = profile.sub;
                        user.email = profile.email;
                        user.save(function () {
                            var token = createToken(user);
                            res.send({
                                token: token,
                                user: user
                            });
                        });
                    });
                });
            } else {
                // Step 3b. Create a new user account or return an existing one.
                User.findOne({
                    googleProfileID: profile.sub
                }, function (err, existingUser) {
                    if (existingUser) {
                        return res.send({
                            token: createToken(existingUser),
                            user: existingUser
                        });
                    }
                    var user = new User();
                    user.googleProfileID = profile.sub;
                    user.email = profile.email;
                    user.save(function (err) {
                        var token = createToken(user);
                        res.send({
                            token: token,
                            user: user
                        });
                    });
                });
            }
        });
    });
});


// *** instagram auth *** //
router.post('/instagram', function (req, res) {
    var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';

    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: config.INSTAGRAM_SECRET,
        code: req.body.code,
        grant_type: 'authorization_code'
    };

    // Step 1. Exchange authorization code for access token.
    request.post({
        url: accessTokenUrl,
        form: params,
        json: true
    }, function (error, response, body) {
        // Step 2a. Link user accounts.
        if (req.headers.authorization) {
            User.findOne({
                instagramProfileID: body.user.id
            }, function (err, existingUser) {
                if (existingUser) {
                    return res.status(409).send({
                        message: 'There is already an Instagram account that belongs to you'
                    });
                }

                var token = req.headers.authorization.split(' ')[1];
                var payload = jwt.decode(token, config.TOKEN_SECRET);

                User.findById(payload.sub, function (err, user) {
                    if (!user) {
                        return res.status(400).send({
                            message: 'User not found'
                        });
                    }
                    user.instagramProfileID = body.user.id;
                    user.email = null;
                    user.save(function () {
                        var token = createToken(user);
                        res.send({
                            token: token,
                            user: user
                        });
                    });
                });
            });
        } else {
            // Step 2b. Create a new user account or return an existing one.
            User.findOne({
                instagramProfileID: body.user.id
            }, function (err, existingUser) {
                if (existingUser) {
                    return res.send({
                        token: createToken(existingUser),
                        user: existingUser
                    });
                }
                var user = new User({
                    instagramProfileID: body.user.id,
                    email: null
                });

                user.save(function () {
                    var token = createToken(user);
                    res.send({
                        token: token,
                        user: user
                    });
                });
            });
        }
    });
});


/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
router.post('/facebook', function (req, res) {
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.FACEBOOK_SECRET,
        redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({
        url: accessTokenUrl,
        qs: params,
        json: true
    }, function (err, response, accessToken) {
        if (response.statusCode !== 200) {
            return res.status(500).send({
                message: accessToken.error.message
            });
        }

        // Step 2. Retrieve profile information about the current user.
        request.get({
            url: graphApiUrl,
            qs: accessToken,
            json: true
        }, function (err, response, profile) {
            if (response.statusCode !== 200) {
                return res.status(500).send({
                    message: profile.error.message
                });
            }
            console.log(profile);
            if (req.headers.authorization) {
                User.findOne({
                    facebook: profile.id
                }, function (err, existingUser) {
                    if (existingUser) {
                        return res.status(409).send({
                            message: 'There is already a Facebook account that belongs to you'
                        });
                    }
                    var token = req.headers.authorization.split(' ')[1];
                    var payload = jwt.decode(token, config.TOKEN_SECRET);
                    User.findById(payload.sub, function (err, user) {
                        if (!user) {
                            return res.status(400).send({
                                message: 'User not found'
                            });
                        }
                        user.facebook = profile.id;
                        user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
                        user.displayName = user.displayName || profile.name;
                        user.save(function () {
                            var token = createJWT(user);
                            res.send({
                                token: token
                            });
                        });
                    });
                });
            } else {
                // Step 3b. Create a new user account or return an existing one.
                User.findOne({
                    facebook: profile.id
                }, function (err, existingUser) {
                    if (existingUser) {
                        var token = createJWT(existingUser);
                        return res.send({
                            token: token
                        });
                    }
                    var user = new User();
                    user.facebook = profile.id;
                    user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                    user.displayName = profile.name;
                    user.save(function () {
                        var token = createJWT(user);
                        res.send({
                            token: token
                        });
                    });
                });
            }
        });
    });
});

/*
 |--------------------------------------------------------------------------
 | Login with Twitter
 |--------------------------------------------------------------------------
 */
router.post('/twitter', function (req, res) {
    var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

    // Part 1 of 2: Initial request from Satellizer.
    if (!req.body.oauth_token || !req.body.oauth_verifier) {
        var requestTokenOauth = {
            consumer_key: config.TWITTER_KEY,
            consumer_secret: config.TWITTER_SECRET,
            callback: req.body.redirectUri
        };

        // Step 1. Obtain request token for the authorization popup.
        request.post({
            url: requestTokenUrl,
            oauth: requestTokenOauth
        }, function (err, response, body) {
            var oauthToken = qs.parse(body);

            // Step 2. Send OAuth token back to open the authorization screen.
            res.send(oauthToken);
        });
    } else {
        // Part 2 of 2: Second request after Authorize app is clicked.
        var accessTokenOauth = {
            consumer_key: config.TWITTER_KEY,
            consumer_secret: config.TWITTER_SECRET,
            token: req.body.oauth_token,
            verifier: req.body.oauth_verifier
        };

        // Step 3. Exchange oauth token and oauth verifier for access token.
        request.post({
            url: accessTokenUrl,
            oauth: accessTokenOauth
        }, function (err, response, accessToken) {

            accessToken = qs.parse(accessToken);

            var profileOauth = {
                consumer_key: config.TWITTER_KEY,
                consumer_secret: config.TWITTER_SECRET,
                oauth_token: accessToken.oauth_token
            };

            // Step 4. Retrieve profile information about the current user.
            request.get({
                url: profileUrl + accessToken.screen_name,
                oauth: profileOauth,
                json: true
            }, function (err, response, profile) {

                // Step 5a. Link user accounts.
                if (req.headers.authorization) {
                    User.findOne({
                        twitter: profile.id
                    }, function (err, existingUser) {
                        if (existingUser) {
                            return res.status(409).send({
                                message: 'There is already a Twitter account that belongs to you'
                            });
                        }

                        var token = req.headers.authorization.split(' ')[1];
                        var payload = jwt.decode(token, config.TOKEN_SECRET);

                        User.findById(payload.sub, function (err, user) {
                            if (!user) {
                                return res.status(400).send({
                                    message: 'User not found'
                                });
                            }

                            user.twitter = profile.id;
                            user.displayName = user.displayName || profile.name;
                            user.picture = user.picture || profile.profile_image_url.replace('_normal', '');
                            user.save(function (err) {
                                res.send({
                                    token: createJWT(user)
                                });
                            });
                        });
                    });
                } else {
                    // Step 5b. Create a new user account or return an existing one.
                    User.findOne({
                        twitter: profile.id
                    }, function (err, existingUser) {
                        if (existingUser) {
                            return res.send({
                                token: createJWT(existingUser)
                            });
                        }

                        var user = new User();
                        user.twitter = profile.id;
                        user.displayName = profile.name;
                        user.picture = profile.profile_image_url.replace('_normal', '');
                        user.save(function () {
                            res.send({
                                token: createJWT(user)
                            });
                        });
                    });
                }
            });
        });
    }
});



module.exports = router;