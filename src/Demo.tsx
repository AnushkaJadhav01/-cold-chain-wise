import { useState } from "react";

export default function Demo() {
  const [steps, setSteps] = useState<string[]>([]);

  const runSimulation = async () => {
    try {
      const res = await fetch("http://localhost:5000/run-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          temperature: 85,
          humidity: 75,
          device_id: "TRUCK_101"
        })
      });

      const data = await res.json();
      setSteps(data.steps);

    } catch (error) {
      console.error(error);
      setSteps(["❌ Backend connection failed"]);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>🚛 Cold Chain AI Agent</h1>

      <button onClick={runSimulation}>
        Run AI Agent
      </button>

      <div style={{ marginTop: "30px" }}>
        {steps.map((step, index) => (
          <p key={index}>{step}</p>
        ))}
      </div>
    </div>
  );
}