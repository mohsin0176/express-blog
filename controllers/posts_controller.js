const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const Post = require('../models/post');

const validations = [
    check('title').not().isEmpty(),
    check('description').not().isEmpty()
];

router.get('/', function(req, res, next) {
    Post.all(null, function(err, posts) {
        if(err) {
            res.redirect('/');
        } else {
            res.render('posts/index', {posts: posts.rows, csrfToken: req.csrfToken()})
        }
    });
});

router.get('/new', function(req, res, next) {
    res.render('posts/new', { csrfToken: req.csrfToken() });
});

router.post('/create', validations, function(req, res, next) {
    var errors = validationResult(req);

    console.log(errors.array());
    if(!errors.isEmpty()) {
        res.render('posts/new', { csrfToken: req.csrfToken(), errors: errors.array() });
    } else {
        Post.create(req.body, function(err, result) {
            if(err) {
                res.render('posts/new', { csrfToken: req.csrfToken() });
            } else {
                res.redirect('/posts');
            }
        });
    }
});

router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    Post.find_by_id(id, function(err, post) {
        if(err) {
            res.render('/');
        } else {
            res.render('posts/show', {post: post.rows[0]});
        }
    });
});


router.get('/:id/edit', function(req, res, next) {
    const id = req.params.id;
    Post.find_by_id(id, function(err, post) {
        if(err) {
            res.render('/'+id+'/edit');
        } else {
            res.render('posts/edit', {post: post.rows[0], csrfToken: req.csrfToken()});
        }
    });
});

router.put('/:id/update', function(req, res, next) {
    const id = req.params.id;
    Post.update(id, req.body, function(err, result) {
        if(err) {
            res.render('/'+id+'/edit');
        } else {
            res.redirect('/posts');
            return;
        }
    });
});


router.delete('/:id', function(req, res, next) {
    const id = req.params.id;
    Post.delete(id, function(err, result) {
        if(err) {
            res.redirect('/posts');
        } else {
            res.redirect('/posts');
        }
    });
});

module.exports = router;
