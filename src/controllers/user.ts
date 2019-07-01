import express from "express";
import User from "../models/user";
import initCRUD from "../utils/crudFactory";

const router = express.Router({mergeParams: true});
const [create, get, update, all] = initCRUD(User);

router.get("/", all);
router.get("/:id", get);
router.put("/:id", update);
router.post("/", create);

export default router;