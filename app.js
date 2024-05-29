const express = require("express");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;

// Skapa en array för att lagra inlägg i minnet
let posts = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index", { posts });
});

app.get("/posts/new", (req, res) => {
  res.render("newPost");
});

app.get("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const post = posts[postId];
  if (post) {
    res.render("showPost", { post });
  } else {
    res.status(404).send("Inlägg hittades inte.");
  }
});

app.post("/posts", (req, res) => {
  const { title, content } = req.body;
  const newPost = { id: uuidv4(), title, content }; // Använd UUID för att skapa ett unikt ID
  posts.push(newPost);
  res.redirect("/");
});

app.put("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex !== -1) {
    posts[postIndex] = {
      id: postId,
      title: req.body.title,
      content: req.body.content,
    };
    // Omdirigera till startsidan istället för inläggssidan
    res.redirect("/");
  } else {
    res.status(404).send("Inlägg hittades inte.");
  }
});

app.delete("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const postIndex = posts.findIndex((post) => post.id === postId);
  posts.splice(postIndex, 1);
  res.redirect("/");
});

app.get("/posts/:id/edit", (req, res) => {
  const postId = req.params.id;
  const post = posts.find((p) => p.id === postId); // Hitta inlägget med rätt ID
  if (post) {
    res.render("editPost", { post }); // Se till att "editPost" är namnet på din EJS-fil för redigering
  } else {
    res.status(404).send("Inlägg hittades inte.");
  }
});

// Starta servern
app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});
