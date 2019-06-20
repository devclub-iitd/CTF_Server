import express from "express";
import Problem from "../models/problem";
import initCRUD from "../utils/crudFactory";

const router = express.Router({mergeParams: true});
const [create, get, update, all] = initCRUD(Problem);

router.post('/',create);
router.get('/',all);
router.get('/:id',get);
router.put('/:id',update);

export default router;