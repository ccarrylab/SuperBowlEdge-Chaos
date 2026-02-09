// [Previous component code...]
const triggerExperiment = async (experimentId: string) => {
  setRunning(experimentId);
  // ... rest same
};

// In Button section, add cooldown:
{results[exp.id] === "success" && (
  <motion.div className="flex-shrink-0 text-xs text-green-500">
    ✓ Cooldown 5min
  </motion.div>
)}
