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

};
