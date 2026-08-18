import mqtt, { MqttClient } from "mqtt";

const MQTT_HOST = process.env.MQTT_HOST || "localhost";
const MQTT_PORT = process.env.MQTT_PORT || "1883";

export const mqttClient: MqttClient = mqtt.connect(
    `mqtt://${MQTT_HOST}:${MQTT_PORT}`,
);

mqttClient.on("connect", () =>
    console.info(`MQTT client connected to ${MQTT_HOST}:${MQTT_PORT}`),
);

mqttClient.on("reconnect", () => console.warn("MQTT client reconnecting..."));

mqttClient.on("error", (error: any) =>
    console.error("MQTT client error.", error),
);

mqttClient.on("close", () => console.warn("MQTT client connection closed."));
