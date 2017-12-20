const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];
let postId = 0;
const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: your code to handle requests
server.get('/posts', (req, res) => {
  const queryString = req.query.term;
  if (queryString) {
    const post = posts.filter((p) => {
      return p.title === queryString || p.contents === queryString;
    });
    res.status(200).json(post);
  } else {
    res.status(200).json(posts);
  }
});

server.post('/posts', (req, res) => {
  const post = req.body;
  if (!post.title) {
    res.status(STATUS_USER_ERROR).json({ error: 'Please have a title' });
    return undefined;
  }
  if (!post.contents) {
    res.status(STATUS_USER_ERROR).json({ error: 'Please have a title, contents' });
    return undefined;
  }
  post.id = postId;
  postId++;
  posts.push(post);
  res.status(200).json(posts);
});

server.put('/posts', (req, res) => {
  const { id, title, contents } = req.body;
  if (!id) {
    res.status(STATUS_USER_ERROR).json({ error: 'Please have an id' });
    return undefined;
  }
  if (!title) {
    res.status(STATUS_USER_ERROR).json({ error: 'Please have a title' });
    return undefined;
  }
  if (!contents) {
    res.status(STATUS_USER_ERROR).json({ error: 'Please have a contents' });
    return undefined;
  }
  const post = posts.find(p => p.id === id);
  if (!post) {
    res.status(STATUS_USER_ERROR).json({ error: 'Could not find post' });
    return undefined;
  }
  post.title = title;
  post.contents = contents;
  res.status(200).json(posts);
});

server.delete('/posts', (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(STATUS_USER_ERROR).json({ error: 'Please give id' });
    return undefined;
  }
  const post = posts.find(p => p.id !== id);
  if (!post) {
    res.status(STATUS_USER_ERROR).json({ error: 'Could not find post' });
    return undefined;
  }
  posts = posts.filter(p => p.id !== id);
  res.status(200).json({ success: 'Delete the post' });
});
module.exports = { posts, server };
