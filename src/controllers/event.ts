import express from "express";
import Event from "../models/event";
import initCRUD from "../utils/crudFactory";

const router = express.Router({mergeParams: true});
const [create, get, update, all, get_filter] = initCRUD(Event);

router.post('/',create);
router.get('/', all);
router.get('/:id',get);
router.put('/:id',update);
router.get('/filter', get_filter);

export default router;