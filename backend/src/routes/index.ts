import { Router } from 'express';
import UserController from '../controllers/UserController';
import TenantController from '../controllers/TenantController';
import CallController from '../controllers/CallController';
import CallLogController from '../controllers/CallLogController';
import WavoipTokenController from '../controllers/WavoipTokenController';
import VapiTokenController from '../controllers/VapiTokenController';

const router = Router();

// User routes
router.post('/users', UserController.createUser);
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// Tenant routes
router.post('/tenants', TenantController.createTenant);
router.get('/tenants/:id', TenantController.getTenantById);
router.put('/tenants/:id', TenantController.updateTenant);
router.delete('/tenants/:id', TenantController.deleteTenant);

// Call routes
router.post('/calls', CallController.createCall);
router.get('/calls/:id', CallController.getCallById);
router.put('/calls/:id', CallController.updateCall);
router.delete('/calls/:id', CallController.deleteCall);

// CallLog routes
router.post('/call-logs', CallLogController.createCallLog);
router.get('/call-logs/:id', CallLogController.getCallLogById);
router.put('/call-logs/:id', CallLogController.updateCallLog);
router.delete('/call-logs/:id', CallLogController.deleteCallLog);

// WavoipToken routes
router.post('/wavoip-tokens', WavoipTokenController.createWavoipToken);
router.get('/wavoip-tokens/:id', WavoipTokenController.getWavoipTokenById);
router.put('/wavoip-tokens/:id', WavoipTokenController.updateWavoipToken);
router.delete('/wavoip-tokens/:id', WavoipTokenController.deleteWavoipToken);
router.get('/wavoip-tokens/check-availability', WavoipTokenController.checkDeviceAvailability);

// VapiToken routes
router.post('/vapi-tokens', VapiTokenController.createVapiToken);
router.get('/vapi-tokens/:id', VapiTokenController.getVapiTokenById);
router.put('/vapi-tokens/:id', VapiTokenController.updateVapiToken);
router.delete('/vapi-tokens/:id', VapiTokenController.deleteVapiToken);
router.get('/vapi-tokens/assistants', VapiTokenController.listAssistants);
router.get('/vapi-tokens/phone-numbers', VapiTokenController.listPhoneNumbers);

export default router;
