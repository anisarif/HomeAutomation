"""
RuView Presence Bridge  (Pi-direct deployment)
present_moving | present_static → light ON
no_presence for AWAY_TIMEOUT    → light OFF
Auto-mode state cached, refreshed every 10s (not every frame).
"""

import asyncio, websockets, json, requests, time, logging

logging.basicConfig(level=logging.INFO,
    format="%(asctime)s [RuView Bridge] %(message)s", datefmt="%H:%M:%S")
log = logging.getLogger(__name__)

RUVIEW_WS    = "ws://localhost:8765/ws/sensing"
HOME_API     = "http://localhost:5000"
LIGHT_ID     = 1
AWAY_TIMEOUT = 5
IN_ROOM      = {"present_moving", "present_static"}

# ── Auto-mode cache (refresh every 10s, not every frame) ──
_auto_mode_value     = True
_auto_mode_fetched   = 0.0
AUTO_MODE_CACHE_SECS = 2

def is_auto_mode_enabled() -> bool:
    global _auto_mode_value, _auto_mode_fetched
    if time.time() - _auto_mode_fetched > AUTO_MODE_CACHE_SECS:
        try:
            r = requests.get(f"{HOME_API}/api/auto-mode/{LIGHT_ID}", timeout=2)
            _auto_mode_value   = r.json().get("enabled", True)
            _auto_mode_fetched = time.time()
            log.info(f"Auto-mode refreshed → {_auto_mode_value}")
        except Exception:
            pass  # keep previous cached value
    return _auto_mode_value

def set_light(state: bool):
    try:
        r = requests.post(f"{HOME_API}/api/act/{LIGHT_ID}",
                          json={"state": state}, timeout=3)
        log.info(f"💡 Light {'ON' if state else 'OFF'} → {r.text.strip()}")
    except requests.exceptions.RequestException as e:
        log.error(f"HomeAutomation API error: {e}")

async def watch():
    light_on  = False
    last_seen = 0.0
    log.info(f"Connecting to {RUVIEW_WS} | Light={LIGHT_ID} | Timeout={AWAY_TIMEOUT}s")

    async for websocket in websockets.connect(RUVIEW_WS, ping_interval=20):
        try:
            async for raw in websocket:
                if not is_auto_mode_enabled():
                    if light_on:
                        log.info("Auto-mode OFF — handing control to user")
                        light_on = False
                    continue

                d       = json.loads(raw)
                now     = time.time()
                motion  = (d.get("classification") or {}).get("motion_level", "")
                in_room = motion in IN_ROOM

                if in_room:
                    last_seen = now
                    if not light_on:
                        log.info(f"Presence ({motion}) → light ON")
                        set_light(True)
                        light_on = True
                elif light_on and (now - last_seen) >= AWAY_TIMEOUT:
                    log.info(f"No presence {AWAY_TIMEOUT}s ({motion}) → light OFF")
                    set_light(False)
                    light_on = False

        except websockets.ConnectionClosed:
            log.warning("WS closed, reconnecting in 5s...")
            await asyncio.sleep(5)
        except json.JSONDecodeError as e:
            log.warning(f"Bad message: {e}")

if __name__ == "__main__":
    asyncio.run(watch())
