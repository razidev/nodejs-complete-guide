const  { validationResult } =  require('express-validator');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: '1',
            title: 'First Post',
            content: 'This is the content of the first post.',
            imageUrl: 'images/me.jpg',
            creator: {
                name: 'John Doe'
            },
            createdAt: new Date()
        }]
    })
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    const title = req.body.title;
    const content = req.body.content;
    console.log(req.body)
    res.status(201).json({
        message: 'Post created successfully',
        post: {
            _id: new Date().toDateString(),
            title: title,
            content: content,
            creator: {
                name: 'John Doe'
            },
            createdAt: new Date()
        }
    })
};
