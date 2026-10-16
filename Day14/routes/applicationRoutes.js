import { Router } from "express";
import { apiKeyMiddleware } from "../middleware/apiKey.js";
import { addApplication, editApplication, getApplication, getApplications, removeApplication } from "../controllers/applicationController.js";
import { validateApplicationId } from "../middleware/validateApplicationId.js";

const router = Router();

router.use(apiKeyMiddleware);

// protect all job pplication endpoints
router.use(apiKeyMiddleware);

router.get('/', getApplications);
router.get('/:id', validateApplicationId, getApplication);
router.post('/', validateApplicationId, addApplication);
router.patch('/:id', validateApplicationId, validateApplicationId, editApplication);
router.delete('/:id', validateApplicationId, removeApplication);

export default router;