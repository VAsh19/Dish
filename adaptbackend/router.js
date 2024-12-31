const dishRoutes = require("./routes/dish");

//* Here I defined the first endpoint
const router = (app) => {
  app.use("/dish", dishRoutes);
};

module.exports = router;
