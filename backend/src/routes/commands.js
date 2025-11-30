const express = require('express');
const router = express.Router();
const teslaApi = require('../services/teslaApi');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

// ==========================================
// CLIMATE COMMANDS
// ==========================================

// Start climate
router.post('/:vehicleId/climate/start', async (req, res) => {
  try {
    const result = await teslaApi.startClimate(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Stop climate
router.post('/:vehicleId/climate/stop', async (req, res) => {
  try {
    const result = await teslaApi.stopClimate(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set temperature
router.post('/:vehicleId/climate/temps', async (req, res) => {
  try {
    const { driverTemp, passengerTemp } = req.body;
    const result = await teslaApi.setTemps(req.session.accessToken, req.params.vehicleId, driverTemp, passengerTemp);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set seat heater
router.post('/:vehicleId/climate/seat-heater', async (req, res) => {
  try {
    const { seat, level } = req.body;
    const result = await teslaApi.setSeatHeater(req.session.accessToken, req.params.vehicleId, seat, level);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set seat cooler
router.post('/:vehicleId/climate/seat-cooler', async (req, res) => {
  try {
    const { seat, level } = req.body;
    const result = await teslaApi.setSeatCooler(req.session.accessToken, req.params.vehicleId, seat, level);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set steering wheel heater
router.post('/:vehicleId/climate/steering-wheel-heater', async (req, res) => {
  try {
    const { on } = req.body;
    const result = await teslaApi.setSteeringWheelHeater(req.session.accessToken, req.params.vehicleId, on);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set climate keeper mode
router.post('/:vehicleId/climate/keeper-mode', async (req, res) => {
  try {
    const { mode } = req.body; // 0=Off, 1=Keep, 2=Dog, 3=Camp
    const result = await teslaApi.setClimateKeeperMode(req.session.accessToken, req.params.vehicleId, mode);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set bioweapon mode
router.post('/:vehicleId/climate/bioweapon-mode', async (req, res) => {
  try {
    const { on } = req.body;
    const result = await teslaApi.setBioweaponMode(req.session.accessToken, req.params.vehicleId, on);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set cabin overheat protection
router.post('/:vehicleId/climate/cabin-overheat-protection', async (req, res) => {
  try {
    const { on, fanOnly } = req.body;
    const result = await teslaApi.setCabinOverheatProtection(req.session.accessToken, req.params.vehicleId, on, fanOnly);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set preconditioning max
router.post('/:vehicleId/climate/preconditioning-max', async (req, res) => {
  try {
    const { on } = req.body;
    const result = await teslaApi.setPreconditioningMax(req.session.accessToken, req.params.vehicleId, on);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// ==========================================
// CHARGING COMMANDS
// ==========================================

// Open charge port
router.post('/:vehicleId/charging/open-port', async (req, res) => {
  try {
    const result = await teslaApi.openChargePort(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Close charge port
router.post('/:vehicleId/charging/close-port', async (req, res) => {
  try {
    const result = await teslaApi.closeChargePort(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Start charging
router.post('/:vehicleId/charging/start', async (req, res) => {
  try {
    const result = await teslaApi.startCharging(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Stop charging
router.post('/:vehicleId/charging/stop', async (req, res) => {
  try {
    const result = await teslaApi.stopCharging(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set charge limit
router.post('/:vehicleId/charging/limit', async (req, res) => {
  try {
    const { percent } = req.body;
    const result = await teslaApi.setChargeLimit(req.session.accessToken, req.params.vehicleId, percent);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set charging amps
router.post('/:vehicleId/charging/amps', async (req, res) => {
  try {
    const { amps } = req.body;
    const result = await teslaApi.setChargingAmps(req.session.accessToken, req.params.vehicleId, amps);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Charge max range
router.post('/:vehicleId/charging/max-range', async (req, res) => {
  try {
    const result = await teslaApi.chargeMaxRange(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Charge standard
router.post('/:vehicleId/charging/standard', async (req, res) => {
  try {
    const result = await teslaApi.chargeStandard(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set scheduled charging
router.post('/:vehicleId/charging/schedule', async (req, res) => {
  try {
    const { enable, time } = req.body;
    const result = await teslaApi.setScheduledCharging(req.session.accessToken, req.params.vehicleId, enable, time);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Add charge schedule
router.post('/:vehicleId/charging/add-schedule', async (req, res) => {
  try {
    const result = await teslaApi.addChargeSchedule(req.session.accessToken, req.params.vehicleId, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Remove charge schedule
router.post('/:vehicleId/charging/remove-schedule', async (req, res) => {
  try {
    const { id } = req.body;
    const result = await teslaApi.removeChargeSchedule(req.session.accessToken, req.params.vehicleId, id);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// ==========================================
// LOCKS & SECURITY COMMANDS
// ==========================================

// Lock doors
router.post('/:vehicleId/security/lock', async (req, res) => {
  try {
    const result = await teslaApi.lockDoors(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Unlock doors
router.post('/:vehicleId/security/unlock', async (req, res) => {
  try {
    const result = await teslaApi.unlockDoors(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Actuate trunk
router.post('/:vehicleId/security/trunk', async (req, res) => {
  try {
    const { which_trunk } = req.body; // "front" or "rear"
    const result = await teslaApi.actuateTrunk(req.session.accessToken, req.params.vehicleId, which_trunk);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set sentry mode
router.post('/:vehicleId/security/sentry', async (req, res) => {
  try {
    const { on } = req.body;
    const result = await teslaApi.setSentryMode(req.session.accessToken, req.params.vehicleId, on);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set valet mode
router.post('/:vehicleId/security/valet', async (req, res) => {
  try {
    const { on, password } = req.body;
    const result = await teslaApi.setValetMode(req.session.accessToken, req.params.vehicleId, on, password);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set speed limit
router.post('/:vehicleId/security/speed-limit', async (req, res) => {
  try {
    const { limit_mph } = req.body;
    const result = await teslaApi.setSpeedLimit(req.session.accessToken, req.params.vehicleId, limit_mph);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Activate speed limit
router.post('/:vehicleId/security/speed-limit/activate', async (req, res) => {
  try {
    const { pin } = req.body;
    const result = await teslaApi.activateSpeedLimit(req.session.accessToken, req.params.vehicleId, pin);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Deactivate speed limit
router.post('/:vehicleId/security/speed-limit/deactivate', async (req, res) => {
  try {
    const { pin } = req.body;
    const result = await teslaApi.deactivateSpeedLimit(req.session.accessToken, req.params.vehicleId, pin);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set guest mode
router.post('/:vehicleId/security/guest-mode', async (req, res) => {
  try {
    const { enable } = req.body;
    const result = await teslaApi.setGuestMode(req.session.accessToken, req.params.vehicleId, enable);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// ==========================================
// WINDOWS & SUNROOF COMMANDS
// ==========================================

// Control windows
router.post('/:vehicleId/windows', async (req, res) => {
  try {
    const { command, lat, lon } = req.body; // command: "vent" or "close"
    const result = await teslaApi.controlWindows(req.session.accessToken, req.params.vehicleId, command, lat, lon);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Control sunroof
router.post('/:vehicleId/sunroof', async (req, res) => {
  try {
    const { state } = req.body; // "stop", "close", "vent"
    const result = await teslaApi.controlSunroof(req.session.accessToken, req.params.vehicleId, state);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// ==========================================
// LIGHTS & HORN COMMANDS
// ==========================================

// Flash lights
router.post('/:vehicleId/lights/flash', async (req, res) => {
  try {
    const result = await teslaApi.flashLights(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Honk horn
router.post('/:vehicleId/horn', async (req, res) => {
  try {
    const result = await teslaApi.honkHorn(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Remote boombox
router.post('/:vehicleId/boombox', async (req, res) => {
  try {
    const { sound } = req.body; // 0=fart, 2000=locate
    const result = await teslaApi.remoteBoombox(req.session.accessToken, req.params.vehicleId, sound);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// ==========================================
// MEDIA COMMANDS
// ==========================================

// Adjust volume
router.post('/:vehicleId/media/volume', async (req, res) => {
  try {
    const { volume } = req.body;
    const result = await teslaApi.adjustVolume(req.session.accessToken, req.params.vehicleId, volume);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Toggle playback
router.post('/:vehicleId/media/toggle', async (req, res) => {
  try {
    const result = await teslaApi.mediaTogglePlayback(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Next track
router.post('/:vehicleId/media/next', async (req, res) => {
  try {
    const result = await teslaApi.mediaNextTrack(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Previous track
router.post('/:vehicleId/media/prev', async (req, res) => {
  try {
    const result = await teslaApi.mediaPrevTrack(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// ==========================================
// NAVIGATION COMMANDS
// ==========================================

// Send navigation
router.post('/:vehicleId/navigation/share', async (req, res) => {
  try {
    const { type, value, locale } = req.body;
    const result = await teslaApi.navigationRequest(req.session.accessToken, req.params.vehicleId, type, value, locale);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Send GPS coordinates
router.post('/:vehicleId/navigation/gps', async (req, res) => {
  try {
    const { lat, lon, order } = req.body;
    const result = await teslaApi.navigationGpsRequest(req.session.accessToken, req.params.vehicleId, lat, lon, order);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Navigate to supercharger
router.post('/:vehicleId/navigation/supercharger', async (req, res) => {
  try {
    const { id, order } = req.body;
    const result = await teslaApi.navigationScRequest(req.session.accessToken, req.params.vehicleId, id, order);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// ==========================================
// SOFTWARE & MISC COMMANDS
// ==========================================

// Wake up vehicle
router.post('/:vehicleId/wake', async (req, res) => {
  try {
    const result = await teslaApi.wakeUpVehicle(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Schedule software update
router.post('/:vehicleId/software/schedule', async (req, res) => {
  try {
    const { offset_sec } = req.body;
    const result = await teslaApi.scheduleSoftwareUpdate(req.session.accessToken, req.params.vehicleId, offset_sec);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Cancel software update
router.post('/:vehicleId/software/cancel', async (req, res) => {
  try {
    const result = await teslaApi.cancelSoftwareUpdate(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Remote start drive
router.post('/:vehicleId/remote-start', async (req, res) => {
  try {
    const result = await teslaApi.remoteStartDrive(req.session.accessToken, req.params.vehicleId);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Trigger HomeLink
router.post('/:vehicleId/homelink', async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const result = await teslaApi.triggerHomelink(req.session.accessToken, req.params.vehicleId, lat, lon);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Set vehicle name
router.post('/:vehicleId/name', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await teslaApi.setVehicleName(req.session.accessToken, req.params.vehicleId, name);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

module.exports = router;
