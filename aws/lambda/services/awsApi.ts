export async function getRiskPrediction(data: any) {
  const response = await fetch(
    "https://example-api.execute-api.us-east-1.amazonaws.com/predict",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  return response.json();
}
