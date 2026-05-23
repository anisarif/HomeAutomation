"""
RuView Presence Bridge  (Pi-direct deployment)
Connects RuView WiFi sensing to HomeAutomation light control.

Watches /ws/sensing WebSocket from RuView sensing server running on this Pi.
When a person is detected in the room with sufficient confidence,
calls the HomeAutomation /api/act/<id> endpoint to turn the light on/off.
Respects the /api/auto-mode/<id> flag — does nothing if auto-mode is off.

Deploy:
    sudo cp Backend/ruview_presence_bridge.py /usr/local/bin/ruview-presence-bridge.py
    sudo systemctl restart ruview-presence
"""

import asyncio
import websockets
import json
import requests
import time
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [RuView Bridge] %(message)s",
    datefmt="%H:%M:%S"
)
log = logging.getLogger(__name__)

# ── Config ───────────────────────────────────────────────
RUVIEW_WS      = "ws://localhost:8765/ws/sensing"  # RuView sensing server (this Pi)
HOME_API       = "http://localhost:5000"            # HomeAutomation Flask API (this Pi)
LIGHT_ID       = 1                                  # "Light 1" actuator ID
CONFIDENCE_MIN = 0.75    # Ignore detections below this confidence (0-1)
AWAY_TIMEOUT   = 5       # Seconds empty before turning light off
# ────────────────────────────────────────────────────────


def is_auto_mode_enabled() -> bool:
    """Check if auto-mode is enabled for this light via the backend API."""
    try:
        r = requests.get(f"{HOME_API}/api/auto-mode/{LIGHT_ID}", timeout=2)
        return r.json().get("enabled", True)
    except Exception:
        return True  # default to enabled if API is unreachable


def set_light(state: bool):
    """Call the existing /api/act/<id> endpoint to control the light."""
    try:
        r = requests.post(
            f"{HOME_API}/api/act/{LIGHT_ID}",
            json={"state": state},
            timeout=3
        )
        log.info(f"💡 Light {'ON' if state else 'OFF'} → {r.text.strip()}")
    except requests.exceptions.RequestException as e:
        log.error(f"Failed to reach HomeAutomation API: {e}")


async def watch():
    light_on  = False
    last_seen = 0.0

    log.info(f"Connecting to RuView at {RUVIEW_WS}")
    log.info(f"Controlling Light ID={LIGHT_ID} via {HOME_API}")
    log.info(f"Confidence threshold: {CONFIDENCE_MIN} | Away timeout: {AWAY_TIMEOUT}s")

    # Outer async-for is websockets v10+ built-in reconnect loop
    async for websocket in websockets.connect(RUVIEW_WS, ping_interval=20):
        try:
            async for raw in websocket:
                if not is_auto_mode_enabled():
                    continue  # manual mode — let the user control the light

                d = json.loads(raw)
                now = time.time()

                # Server sends persons[] array with per-person confidence.
                # Top-level "presence" and "confidence" may be null — use persons instead.
                persons   = d.get("persons") or []
                confident = [p for p in persons if p.get("confidence", 0) >= CONFIDENCE_MIN]
                in_room   = len(confident) > 0

                # Also accept top-level presence flag if populated
                if not in_room and d.get("presence") and d.get("confidence", 0) >= CONFIDENCE_MIN:
                    in_room = True

                if in_room:
                    last_seen = now
                    best_conf = max((p.get("confidence", 0) for p in persons), default=d.get("confidence", 0))
                    if not light_on:
                        log.info(
                            f"Person detected (confidence={best_conf:.2f}, n={len(persons)}) "
                            f"motion={d.get('motion_level', '?')}"
                        )
                        set_light(True)
                        light_on = True

                elif light_on and (now - last_seen) >= AWAY_TIMEOUT:
                    log.info(f"Room empty for {AWAY_TIMEOUT}s → turning light off")
                    set_light(False)
                    light_on = False

        except websockets.ConnectionClosed:
            log.warning("RuView WebSocket closed, reconnecting in 5s...")
            await asyncio.sleep(5)
        except json.JSONDecodeError as e:
            log.warning(f"Bad message from RuView: {e}")


if __name__ == "__main__":
    asyncio.run(watch())
