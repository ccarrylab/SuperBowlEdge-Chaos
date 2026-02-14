import { ChaosExperiments } from '../../src/sections/TryChaos.tsx'
export default function ChaosPage() {
  return (
    <div className="container mx-auto p-8 py-20 max-w-7xl">
      <h1 className="text-4xl font-bold text-center mb-12">🧨 Chaos Engineering Control Panel</h1>
      <ChaosExperiments />
    </div>
  )
}
