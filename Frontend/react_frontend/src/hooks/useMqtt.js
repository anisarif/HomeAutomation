import { useEffect, useRef } from "react";
// mqtt v5 resolves to its browser bundle via package `exports`/`browser` fields.
import mqtt from "mqtt";

// Real-time transport. The mosquitto broker exposes a WebSocket listener on :9001
// and the URL is baked into the build env (REACT_APP_MQTT_URL). We keep ONE shared
// connection for the whole app and fan every message out to registered subscribers.
const MQTT_URL = process.env.REACT_APP_MQTT_URL || "ws://localhost:9001";

const subscribers = new Set();
let client = null;

function ensureClient() {
  if (client) return;
  client = mqtt.connect(MQTT_URL, {
    reconnectPeriod: 3000,
    connectTimeout: 8000,
    clean: true,
  });
  client.on("connect", () => client.subscribe("#"));
  client.on("message", (topic, payload) => {
    const msg = payload.toString();
    subscribers.forEach((cb) => {
      try {
        cb(topic, msg);
      } catch (e) {
        console.error("mqtt subscriber error:", e);
      }
    });
  });
  // Swallow errors; mqtt.js auto-reconnects on reconnectPeriod.
  client.on("error", () => {});
}

/**
 * Register a handler for every MQTT message. `onMessage(topic, payloadString)`.
 * The latest callback is always used (no stale closures); cleans up on unmount.
 */
export function useMqtt(onMessage) {
  const ref = useRef(onMessage);
  ref.current = onMessage;

  useEffect(() => {
    ensureClient();
    const cb = (topic, msg) => ref.current && ref.current(topic, msg);
    subscribers.add(cb);
    return () => {
      subscribers.delete(cb);
    };
  }, []);
}

export default useMqtt;
