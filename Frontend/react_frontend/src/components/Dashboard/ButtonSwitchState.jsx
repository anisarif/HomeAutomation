import { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";

// Modern sliding toggle. Green = ON, neutral = OFF. Optimistic update with revert
// on failure. Re-syncs to `props.state` whenever the parent pushes fresh state
// (from the poll or the real-time MQTT refetch), so all devices stay in sync.
const ButtonSwitchState = (props) => {
  const { actions } = useContext(Context);
  const [on, setOn] = useState(props.state);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setOn(props.state);
  }, [props.state]);

  const toggle = async () => {
    const next = !on;
    setBusy(true);
    setOn(next); // optimistic
    try {
      const res = await actions.updateState({ lockId: props.lockId, state: next });
      if (res !== true) setOn(!next);
    } catch (error) {
      console.error("An error occurred:", error);
      setOn(!next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={on ? "Turn off" : "Turn on"}
      disabled={busy}
      onClick={toggle}
      style={{ touchAction: "manipulation" }}
      className={`relative inline-flex h-9 w-16 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-60 ${
        on
          ? "border-accent/50 bg-accent/90 shadow-glow-accent"
          : "border-border bg-surface2"
      }`}
    >
      <span
        className={`inline-block h-7 w-7 transform rounded-full bg-white shadow transition-transform duration-200 ${
          on ? "translate-x-8" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default ButtonSwitchState;
