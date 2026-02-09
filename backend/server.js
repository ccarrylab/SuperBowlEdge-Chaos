const express = require('express');
const cors = require('cors');
const { FisClient, StartExperimentCommand } = require('@aws-sdk/client-fis');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const fis = new FisClient({ region: process.env.AWS_REGION || 'us-east-1' });
let experimentRunning = false;

const TEMPLATES = {
  "cpu-stress": process.env.FIS_CPU_STRESS,
  "network-latency": process.env.FIS_NETWORK_LATENCY,
  "instance-termination": process.env.FIS_INSTANCE_TERMINATION,
  "disk-stress": process.env.FIS_DISK_STRESS
};

app.post('/api/chaos/trigger', async (req, res) => {
  if (experimentRunning) {
    return res.status(429).json({ error: 'Experiment already running, try again in 5 minutes' });
  }

  const { experimentId } = req.body;
  const templateId = TEMPLATES[experimentId];

  if (!templateId) {
    return res.status(400).json({ error: 'Invalid experiment', allowed: Object.keys(TEMPLATES) });
  }

  experimentRunning = true;
  setTimeout(() => { experimentRunning = false; }, 5 * 60 * 1000); // 5min cooldown

  try {
    const result = await fis.send(new StartExperimentCommand({
      experimentTemplateId: templateId,
      clientToken: crypto.randomUUID()
    }));

    res.json({
      success: true,
      experimentId: result.experiment?.id,
      status: result.experiment?.state?.status
    });
  } catch (err) {
    experimentRunning = false; // release lock on error
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('Chaos API running on http://localhost:3001'));
