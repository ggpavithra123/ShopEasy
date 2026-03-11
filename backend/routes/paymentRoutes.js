import express from 'express';
import { verifyUserAuth } from '../middleware/userAuth.js';
import { paymentVerification, processPayment, sendAPIKey } from '../controller/paymentController.js';
const router=express.Router();

router.route('/payment/process').post(processPayment)
router.route('/getKey').get(sendAPIKey)
router.route('/paymentVerification').post(paymentVerification)

export default router;
