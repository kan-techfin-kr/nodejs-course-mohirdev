const { Router } = require("express");
const router = Router();



const bookController = require("../controller/BookController");
router.get("/", bookController.getAll);
router.get("/add", bookController.addForm);
router.get("/:id", bookController.getOneById);
router.get("/update/:id", bookController.updateByIdForm);
router.post("/", bookController.createNew);
router.post("/:id", bookController.updateById); // updating post method instead of put
router.delete("/:id", bookController.deleteById);



module.exports = router;