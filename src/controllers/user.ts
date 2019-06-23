import express from "express";
import User from "../models/user";
import initCRUD from "../utils/crudFactory";

const router = express.Router({mergeParams: true});
const [create, get, update, all, get_filter] = initCRUD(User);

router.get('/filter', get_filter);
router.get("/", all);
router.get("/:id", get);
router.put("/:id", update);
router.post("/", create);

export default router;