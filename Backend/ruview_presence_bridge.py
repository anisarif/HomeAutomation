"""
RuView Presence Bridge  (Pi-direct deployment)
Triggers Light 1 based on room presence via WiFi CSI.

  present_moving | present_static → in room → light ON
  no_presence                     → 5s countdown → light OFF

Light stays on whether you're moving or still.
Turns off only after you leave the room for AWAY_TIMEOUT seconds.
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
RUVIEW_WS    = "ws://localhost:8765/ws/sensing"
HOME_API     = "http://localhost:5000"
LIGHT_ID     = 1
AWAY_TIMEOUT = 5       # seconds of no_presence before light turns off
IN_ROOM      = {"present_moving", "present_static"}
# ────────────────────────────────────────────────────────


def is_auto_mode_enabled() -> bool:
    try:
        r = requests.get(f"{HOME_API}/api/auto-mode/{LIGHT_ID}", timeout=2)
        return r.json().get("enabled", True)
    except Exception:
        return True


def set_light(state: bool):
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
    log.info(f"Light ID={LIGHT_ID} | Away timeout={AWAY_TIMEOUT}s")

    async for websocket in websockets.connect(RUVIEW_WS, ping_interval=20):
        try:
            async for raw in websocket:
                if not is_auto_mode_enabled():
                    continue

                d      = json.loads(raw)
                now    = time.time()
                motion = (d.get("classification") or {}).get("motion_level", "")
                in_room = motion in IN_ROOM

                if in_room:
                    last_seen = now
                    if not light_on:
                        log.info(f"Presence detected ({motion}) → light ON")
                        set_light(True)
                        light_on = True

                elif light_on and (now - last_seen) >= AWAY_TIMEOUT:
                    log.info(f"No presence for {AWAY_TIMEOUT}s ({motion}) → light OFF")
                    set_light(False)
                    light_on = False

        except websockets.ConnectionClosed:
            log.warning("WebSocket closed, reconnecting in 5s...")
            await asyncio.sleep(5)
        except json.JSONDecodeError as e:
            log.warning(f"Bad message: {e}")


if __name__ == "__main__":
    asyncio.run(watch())
