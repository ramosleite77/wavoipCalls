import { Router } from 'express';
import UserController from '../controllers/UserController';
import TenantController from '../controllers/TenantController';
import CallController from '../controllers/CallController';
import CallLogController from '../controllers/CallLogController';
import WavoipTokenController from '../controllers/WavoipTokenController';
import VapiTokenController from '../controllers/VapiTokenController';
import SettingsController from '../controllers/SettingsController';
import AuthController from '../controllers/AuthController';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const handleAsync = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

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
router.get('/calls', handleAsync(CallController.listCalls));
router.post('/calls/:id/execute-test', handleAsync(CallController.executeTestCall));

// CallLog routes
router.post('/call-logs', CallLogController.createCallLog);
router.get('/call-logs/:id', CallLogController.getCallLogById);
router.put('/call-logs/:id', CallLogController.updateCallLog);
router.delete('/call-logs/:id', CallLogController.deleteCallLog);
router.get('/call-logs', handleAsync(CallLogController.listCallLogs));

// WavoipToken routes
router.post('/wavoip-tokens', handleAsync(WavoipTokenController.createWavoipToken));
router.get('/wavoip-tokens/:id', handleAsync(WavoipTokenController.getWavoipTokenById));
router.put('/wavoip-tokens/:id', handleAsync(WavoipTokenController.updateWavoipToken));
router.delete('/wavoip-tokens/:id', handleAsync(WavoipTokenController.deleteWavoipToken));
router.get('/wavoip-tokens', handleAsync(WavoipTokenController.listWavoipTokens));
router.get('/wavoip-tokens/:token/check-availability', handleAsync(WavoipTokenController.checkDeviceAvailability));

// VapiToken routes
router.post('/vapi-tokens', handleAsync(VapiTokenController.createVapiToken));
router.get('/vapi-tokens/:id', handleAsync(VapiTokenController.getVapiTokenById));
router.put('/vapi-tokens/:id', handleAsync(VapiTokenController.updateVapiToken));
router.delete('/vapi-tokens/:id', handleAsync(VapiTokenController.deleteVapiToken));
router.get('/vapi-tokens', handleAsync(VapiTokenController.listVapiTokens));
router.get('/vapi-tokens/:id/assistants', handleAsync(VapiTokenController.listAssistants));
router.get('/vapi-tokens/:id/phone-numbers', handleAsync(VapiTokenController.listPhoneNumbers));

// Settings routes - Rotas específicas primeiro
router.post('/settings', handleAsync(SettingsController.createSetting));
router.get('/settings', handleAsync(SettingsController.listSettings));
router.get('/settings/tenant/all', handleAsync(SettingsController.getAllSettingsByTenant));
router.get('/settings/type/:type', handleAsync(SettingsController.getSettingByType));
router.put('/settings/type/:type', handleAsync(SettingsController.updateSettingByType));
router.delete('/settings/type/:type', handleAsync(SettingsController.deleteSettingByType));
// Rotas com parâmetros dinâmicos por último
router.get('/settings/:id', handleAsync(SettingsController.getSettingById));
router.put('/settings/:id', handleAsync(SettingsController.updateSetting));
router.delete('/settings/:id', handleAsync(SettingsController.deleteSetting));

// Auth routes
router.get('/auth/validate-token', AuthController.validateToken);

export default router;
