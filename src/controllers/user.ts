import { default as User } from "../models/user";
import express from "express";
import initCRUD from "../utils/crudFactory";

const router = express.Router({mergeParams: true});
const [create, get, update, all] = initCRUD(User);

// router.post('/',create);
router.get("/", all);
router.get("/:id", get);
router.put("/:id", update);
router.post("/create", create);

export default router;