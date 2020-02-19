const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const Posts = require('../../models/Posts');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   POST api/posts
// @desc    create a post
// @access  Private
router.post('/',[auth, [
    check('text', 'Please enter text for comment').not().isEmpty()
]] ,async(req, res)=> {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Posts ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })

        const post = await newPost.save();
        res.json(post)

    }catch(err)  {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', async (req, res)=> {
    try {
        const posts = await Posts.find().sort({date: -1})

        res.json(posts);
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   GET api/post/:id
// @desc    Get single post
// @access  Private
router.get('/:id', async (req, res) => {
    try {

        const post = await Posts.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg: 'Post not found'})
        }

        res.json(post)

    }catch(err){
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
});

// @route   Delete api/post/:id
// @desc    Remove a post
// @access  Private
router.delete('/:id',auth, async (req, res) => {
    try {

        const post = await Posts.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg: 'Post not found'})
        }

        if(req.user.id !== post.user.toString()) {
            return res.status(401).json({msg:'User not alowed'})
        }

        await post.remove();

        res.json({msg: 'Post Removed'})

    }catch(err){
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
});

// @route   PUT api/post:id
// @desc    update a post
// @access  Private
router.put('/:id', auth, async(req, res) => {
    try {
        const post = await Posts.findById(req.params.id);

        if (!post){
            return res.status(404).json({msg: 'Not Found'});
        }

        if (req.user.id !== post.user.toString()) {
            return res.status(401).json({msg: 'Not allowed'});
        }

        await post.update(req.body);

    }catch(err){
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
});

// @route   PUT api/like/post:id
// @desc    like a post
// @access  Private
router.put('/like/:id', auth, async(req, res) => {
    try{
        const post = await Posts.findById(req.params.id);

        // Check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({msg: 'Post already liked'});
        }

        post.likes.unshift({user: req.user.id});

        await post.save();

        res.json(post.likes)

    }catch(err){
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
})

// @route   PUT api/unlike/post:id
// @desc    unlike a post
// @access  Private
router.put('/unlike/:id', auth, async(req, res) => {
    try{
        const post = await Posts.findById(req.params.id);

        // Check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({msg: 'Post has not yet been liked'});
        }

        //  Get remove index
        const removeInedx = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeInedx, 1);

        await post.save();

        res.json(post.likes)

    }catch(err){
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
})

// @route   POST api/posts/comment/id
// @desc    add comment to post
// @access  Private
router.post('/comment/:id',[auth, [
    check('text', 'Please enter text for comment').not().isEmpty()
]] ,async(req, res)=> {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const post = await Posts.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        post.comments.unshift(newComment);

        post.save();

        res.json(post.comments)

    }catch(err)  {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req,res) => {
    try{
        const post = await Posts.findById(req.params.id);
        console.log(post)
        // Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        // Make sure comment exists 
        if (!comment) {
            return res.status(404).json({msg: 'Comment does not exist'});
        }

        if (req.user.id !== comment.user.toString()) {
            return res.status(401).json({msg: 'User not authorized'});
        }

        //  Get remove index
        const removeInedx = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeInedx, 1);

        await post.save();

        res.json(post.comments)

    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router