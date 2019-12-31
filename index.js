// implement your API here
const express = require("express");
const bodyParser = require("body-parser");
const { find, findById, insert, update, remove } = require("./data/db");

const controlPanel = action => {};

const server = express();
server.use(
  bodyParser.urlencoded({
    extended: true
  })
);

server.use(bodyParser.json());

server.get("/", async (_, res) => {
  res.status(200).send("Hello World");
  return;
});

server
  .route("/api/users")
  .get(async (_, res) => {
    // get all friends and send back
    try {
      const users = await find();
      res.status(200).json(users);
      return;
    } catch (e) {
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
      return;
    }
  })
  .post(async (req, res) => {
    // create user
    // check data
    const { name, bio } = req.body;
    // If the request body is missing the name or bio property:
    if (!name || !bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
      return;
    }
    const user = { name, bio };
    try {
      const { id } = await insert(user);
      const newUser = await findById(id);
      res.status(201).json(newUser);
      return;
    } catch (e) {
      res.status(500).json({
        errorMessage: "There was an error while saving the user to the database"
      });
      return;
    }
  });

server
  .route("/api/users/:id")
  .get(async ({ params: { id } }, res) => {
    try {
      const user = await findById(id);
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
        return;
      }

      res.status(200).json(user);
      return;
    } catch (e) {
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved." });
      return;
    }
  })
  .delete(async ({ params: { id } }, res) => {
    try {
      const user = await findById(id);

      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
        return;
      }

      await remove(id);
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({ errorMessage: "The user could not be removed" });
    }
  })
  .put(async ({ params: { id }, body }, res) => {
    const { name, bio } = req.body;
    // If the request body is missing the name or bio property:
    if (!name || !bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
      return;
    }

    try {
      const user = await findById(id);

      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
        return;
      }

      // update user here
      const updatedUser = { ...user, name, bio };

      // save user
      const savedUser = update(updatedUser.id, updatedUser);
      res.status(200).json(savedUser);
    } catch (e) {
      res
        .status(500)
        .json({ errorMessage: "The user information could not be modified." });
    }
  });

server.listen(process.env.PORT || 3000, () =>
  console.log(`Listening on port 3000`)
);
