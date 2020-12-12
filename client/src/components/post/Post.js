import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import {getPost} from '../../actions/post';
import { connect } from 'react-redux';
import PostItem from '../posts/PostItem';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';


const Post = ({getPost, match, post: {post, loading}}) => {

    useEffect (()=> {
        getPost(match.params.id)
    }, [getPost])

    return loading || post == null ? <Spinner /> : <Fragment>
        <Link to="/posts" className="btn">
            Back to posts
        </Link>
        <PostItem post={post} showActions={false} />
        <CommentForm postId={post._id} />
        <div className="comments">
            {post.comments.map(comment => (
                <CommentItem key={comment._id} comment={comment} postId={post._id} />
            ))}
        </div>
    </Fragment>
};

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};

const mapStateToPros = state => ({
    post: state.post
})

export default connect(mapStateToPros, {getPost}) (Post);