export const handler = async (event) => {
    const { temperature, delay } = JSON.parse(event.body || "{}");

    let riskLevel = "Low";

    if (temperature > 8 || delay > 2) {
        riskLevel = "High";
    } else if (temperature > 5) {
        riskLevel = "Medium";
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            risk: riskLevel,
            message: "Cold chain risk prediction generated"
        })
    };
};
