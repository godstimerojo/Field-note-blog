const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

let nextId = 3;
let posts = [
  {
    id: 1,
    title: "Welcome to Field Notes",
    content:
      "A small place for ideas worth keeping. Write freely, revise carefully, and let your best thoughts find their way into the world.",
    createdAt: new Date("2026-08-20T10:00:00"),
    updatedAt: new Date("2026-08-20T10:00:00"),
  },
  {
    id: 2,
    title: "Make Room for a First Draft",
    content:
      "The first version does not need to be brilliant. It only needs to exist. Once an idea has a shape, you can question it, improve it, and make it useful.",
    createdAt: new Date("2026-08-24T14:30:00"),
    updatedAt: new Date("2026-08-24T14:30:00"),
  },
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.locals.formatDate = (date) =>
  new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);

app.get("/", (req, res) => res.render("index", { posts }));

app.get("/posts/new", (req, res) => res.render("editor", { post: null, error: null }));

app.post("/posts", (req, res) => {
  const title = req.body.title?.trim();
  const content = req.body.content?.trim();
  if (!title || !content) {
    return res.status(400).render("editor", {
      post: { title: req.body.title || "", content: req.body.content || "" },
      error: "A title and some writing are both needed before publishing.",
    });
  }
  const now = new Date();
  posts.unshift({ id: nextId++, title, content, createdAt: now, updatedAt: now });
  res.redirect("/");
});

app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find((item) => item.id === Number(req.params.id));
  if (!post) return res.status(404).render("404");
  res.render("editor", { post, error: null });
});

app.post("/posts/:id", (req, res) => {
  const post = posts.find((item) => item.id === Number(req.params.id));
  if (!post) return res.status(404).render("404");
  const title = req.body.title?.trim();
  const content = req.body.content?.trim();
  if (!title || !content) {
    return res.status(400).render("editor", {
      post: { ...post, title: req.body.title || "", content: req.body.content || "" },
      error: "A title and some writing are both needed before saving.",
    });
  }
  post.title = title;
  post.content = content;
  post.updatedAt = new Date();
  res.redirect("/");
});

app.post("/posts/:id/delete", (req, res) => {
  posts = posts.filter((item) => item.id !== Number(req.params.id));
  res.redirect("/");
});

app.use((req, res) => res.status(404).render("404"));

app.listen(PORT, () => console.log(`Field Notes is running at http://localhost:${PORT}`));
