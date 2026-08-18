import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { TelemetryRecordData } from "./ingestion.payloads";
import ingestionService from "./ingestion.service";

const TOPIC_FILTER = "vehicles/+/telemetry";
const TOPIC_PATTERN = /^vehicles\/(\d+)\/telemetry$/;

class MqttIngestionHandler {
    readonly topic = TOPIC_FILTER;

    handleMessage = async (topic: string, message: Buffer): Promise<void> => {
        try {
            const vehicleId = this.extractVehicleId(topic);
            if (vehicleId === null) {
                console.error(
                    `MQTT: could not extract vehicleId from topic "${topic}". Dropping message.`,
                );
                return;
            }

            let body: unknown;
            try {
                body = JSON.parse(message.toString());
            } catch (parseError) {
                console.error(
                    `MQTT: invalid JSON on topic "${topic}". Dropping message.`,
                    parseError,
                );
                return;
            }

            const record = plainToInstance(TelemetryRecordData, body);
            const errors = await validate(record);

            if (errors.length > 0) {
                console.error(
                    `MQTT: invalid telemetry payload on topic "${topic}". Dropping message.`,
                    errors,
                );
                return;
            }

            await ingestionService.ingestSingle(vehicleId, record);
        } catch (error) {
            console.error(
                `MQTT: unexpected error handling message on topic "${topic}". Dropping message.`,
                error,
            );
        }
    };

    private extractVehicleId = (topic: string): number | null => {
        const match = topic.match(TOPIC_PATTERN);
        return match ? Number(match[1]) : null;
    };
}

export default new MqttIngestionHandler();
