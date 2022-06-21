const { sequelize, User, Post } = require("./models");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// api to add a user
app.post("/users", async (request, respond) => {
  const { name, email, role } = request.body;
  try {
    const data = await User.create({
      name,
      email,
      role,
    });
    return respond.json(data);
  } catch (e) {
    respond.json(e);
  }
});
// api to get all users from database
app.get("/users", async (request, respond) => {
  try {
    const data = await User.findAll();
    return respond.json(data);
  } catch (e) {
    console.log(e);
  }
});
// api to get specific user
app.get("/users/:uuid", async (request, respond) => {
  const uuid = request.params.uuid;
  try {
    const data = await User.findOne({
      where: { uuid },
      include: "posts",
    });
    return respond.json(data);
  } catch (e) {
    console.log(e);
  }
});
// api to create post
app.post("/post", async (request, respond) => {
  const { userUuid, body } = request.body;
  try {
    // finding the user
    const user = await User.findOne({ where: { uuid: userUuid } });
    const data = await Post.create({ body, userId: user.id });
    return respond.json(data);
  } catch (e) {
    console.log(e);
  }
});
// api to get user post
app.get("/post", async (request, respond) => {
  try {
    const data = await Post.findAll({ include: [User] });
    return respond.json(data);
  } catch (e) {
    console.log(e);
  }
});
// api to delete user
app.delete("/users/:uuid", async (request, respond) => {
  const uuid = request.params.uuid;
  try {
    const user = await User.findOne({
      where: { uuid },
    });
    await user.destroy();
    return respond.json({ msg: "user deleted" });
  } catch (e) {
    console.log(e);
  }
});
// api to update user
app.put("/users/:uuid", async (request, respond) => {
  const uuid = request.params.uuid;
  const { name, email, role } = request.body;
  try {
    const user = await User.findOne({
      where: { uuid },
    });
    user.name = name;
    user.email = email;
    user.role = role;
    await user.save();
    return respond.json(user);
  } catch (e) {
    console.log(e);
  }
});
app.listen({ port: 5000 }, async () => {
  console.log("server started");
  await sequelize.authenticate();
  console.log("database started");
});
