// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// const router = server.route()
// to enable parsing of json bodies for post requests
server.use(express.json());

// TODO: your code to handle request
server.post('/posts', (req, res) => {
   const {author, title, contents} = req.body;

   if (!author || !title || !contents) {
      res.status(STATUS_USER_ERROR).json({ error: "No se recibieron los parámetros necesarios para crear el Post" })
   }

   const post = { author, title, contents, id: Math.random() * 3};
   posts.push(post)
   return res.status(200).json(post)
})

server.post('/posts/author/:author', (req, res) => {
   const { title, contents } = req.body;
   const { author } = req.params;

   if (!title || !contents || !author) {
      res.status(STATUS_USER_ERROR).json({ error: "No se recibieron los parámetros necesarios para crear el Post" })
   }

   const post = { author, title, contents, id: Math.random() * 3};
   posts.push(post)
   return res.status(200).json(post)
})

server.get('/posts', (req, res) => {
   const { term } = req.query;

   if (term) {
      return res.json(posts.filter(p => p.title.includes(term) ||  p.contents.includes(term)))
   } else return res.json(posts)
})

server.get('/posts/:author', (req, res) => {
   const { author } = req.params;
   const authorPosts = posts.filter(p => p.author === author)

   if (authorPosts.length) return res.json(authorPosts)
   else return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post del autor indicado"})
})

server.get('/posts/:author/:title', (req, res) => {
   const { author, title } = req.params;

   const authorPosts = posts.filter(p => p.author === author && p.title === title)
   if (authorPosts.length) return res.json(authorPosts)
   else return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado"})
   
})

server.put('/posts', (req, res) => {
   const { id, title, contents} = req.body;
   const post = posts.find(p => p.id === id)

   if (!id || !title || !contents)
      res.status(STATUS_USER_ERROR).json({ error: "No se recibieron los parámetros necesarios para modificar el Post" })

   if (!post) 
      res.status(STATUS_USER_ERROR).json({ error: "No existen posts con el id indicado" })

   post.title = title;
   post.contents = contents;
   res.json(post)
})

server.delete('/posts', (req, res) => {
   const { id } = req.body;
   const post = posts.find(p => p.id === id)

   if (!id) res.status(STATUS_USER_ERROR).json({ error: "No se recibió el parámetro necesario para eliminar el Post" })
   if (!post) res.status(STATUS_USER_ERROR).json({ error: "No existe un post con el id indicado" })

   const filtered = posts.filter(p => p.id !== id)
   posts = filtered;
   res.json({ success: true })
})

server.delete('/author', (req, res) => {
   const { author } = req.body;
   const post = posts.find(p => p.author  === author)

   if (!author ) res.status(STATUS_USER_ERROR).json({ error: "No se recibió el parámetro necesario para eliminar el Post" })
   if (!post) res.status(STATUS_USER_ERROR).json({ error: "No existe el autor indicado" })

   const filtered = posts.filter(p => p.author  !== author)
   const deleted = posts.filter(p => p.author  === author)
   posts = filtered;
   res.json(deleted)
})

module.exports = { posts, server };