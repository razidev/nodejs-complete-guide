const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function() {
    before(function(done) {
        mongoose
          .connect(
            'mongodb+srv://razidev:testing123@cluster0.flgpv.mongodb.net/test-messages?retryWrites=true'
          )
          .then(result => {
            const user = new User({
                email: 'test@test.com',
                password: 'tester',
                name: 'Test',
                posts: [],
                _id: '67d52f5c262b3d22644011bd'
            });

            return user.save();
          })
          .then(() => {
            done();
          })
    })

    after(function(done) {
        User.deleteMany({}).then(() => {
            return mongoose.disconnect();
        })
        .then(() => {
            done();
        })
    })

    it('should add a created post to the posts of the creator', function(done) {
        const req = {
            body: {
                title: 'Title post',
                content: 'content post'
            },
            file: {
                path: 'xyz'
            },
            userId: '67d52f5c262b3d22644011bd'
        };
        const res = {
            status: function() {
                return this;
            },
            json: function() {}
        };

        FeedController.createPost(req, res, () => {}).then(savedUser => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            expect(savedUser.posts[0]).to.have.property('title', 'Title post');
            expect(savedUser.posts[0]).to.have.property('content', 'content post');
            expect(savedUser.posts[0]).to.have.property('imageUrl', 'xyz');
            done();
        })
    })
})