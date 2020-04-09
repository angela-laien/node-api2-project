const express = require("express");

const Posts = require("./db.js");

const router = express.Router();

router.get("/", (req, res) => {
    Posts.find(req.query)
    .then((posts) => {
      res.status(200).json({ queryString: req.query, posts });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({error: "The posts information could not be retrieved."})
    });
});

router.post("/", (req, res) => {
    const data = req.body;
    if (!data.title || !data.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Posts.insert(data)
            .then((post) => {
                res.status(201).json(post);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: "There was an error while saving the post to the database" })
        });
    }
});

router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
    .then((post) => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.delete("/:id", (req, res) => {
    const id = req.params.id;

    Posts.remove(id)
        .then ((count) => {
            if (count) {
                res.status(200).json({ message: `Posts deleted` })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch((error) => {
            console,log(error);
            res.status(500).json({ error: "The post could not be removed" });
        });
});

router.put("/:id", (req, res) => {
    const changes = req.body;

    if (req.body.text == "" || req.body.contents == "") {
      res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
    } else {
        Posts.update(req.params.id, changes)
          .then((count) => {
            if (count > 0) {
              Posts.findById(req.params.id)
                .then((post) => {
                  res.status(200).json(post);
                })
            } else {
              res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "The post information could not be modified." });
          });
    }
});

router.post("/:id/comments", (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const comment = { ...req.body, post_id: id };
    if (!text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
    } else {
        Posts.findById(id)
            .then(post => {
                if (!post.length) {
                    res.status(404).json({ message:"The post with the specified ID does not exist." });
                } else {
                    Posts.insertComment(comment)
                        .then(comment => {
                            res.status(201).json(comment);
                        })
                        .catch(error => {
                            res.status(500).json({ error:"There was an error while saving the comment to the database" });
                });
            }
      })
  }
});

router.get("/:id/comments", (req, res) => {
    Posts.findPostComments(req.params.id)
    .then((comments) => {
        if (comments) {
            res.status(200).json(comments)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    }) 
    .catch((error) => {
        console.log(error);
        res.status(500).json({ error: "The comments information could not be retrieved." })
    });
});

module.exports = router;