const fs = require('fs');
const path = require('path');
const  { validationResult } =  require('express-validator');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post.find().then(posts => {
        res.status(200).json({ posts })
    }).catch(err =>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error; // use throw to reach next middleware error
    }

    if(!req.file) {
        const error = new Error('Image is required');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path.replace("\\" ,"/");
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: {
            name: 'John Doe'
        }
    });
    post.save().then(result => {
        console.log('Created post', result);
        res.status(201).json({
            message: 'Post created successfully',
            post: result
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err); //  use next() to reach next middleware error, because inside the catch block
    })
    
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
       .then(post => {
            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                post: post
            })
        })
       .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error; // use throw to reach next middleware error
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if(req.file) {
        imageUrl = req.file.path.replace("\\", "/");
    }
    if(!imageUrl) {
        const error = new Error('Image is required');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
    .then(post => {
        if (!post) {
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        return post.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Post updated successfully',
            post: result
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if (!post) {
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        clearImage(post.imageUrl);
        return Post.findByIdAndDelete(postId);
    })
    .then(() => {
        res.status(200).json({
            message: 'Post deleted successfully'
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};