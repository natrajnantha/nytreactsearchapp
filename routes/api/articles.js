const router = require("express").Router();
const articlesController = require("../../controllers/articlesController");

// Route for "/api/articles"
router
  .route("/")
  .get(articlesController.findAll)
  .post(articlesController.create);

// Route for "/api/articles/:id"
router
  .route("/:id")
  .get(articlesController.findById)
  .put(articlesController.update)
  .delete(articlesController.remove);

module.exports = router;
