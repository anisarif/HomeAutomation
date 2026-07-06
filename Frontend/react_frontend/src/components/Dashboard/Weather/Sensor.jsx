import React, { useEffect, useState, useContext } from 'react';
import { Context } from "../../../store/appContext";
import { Home, Thermometer, Droplets } from "lucide-react";
import Card from "../../ui/Card";
import { useMqtt } from "../../../hooks/useMqtt";

const fmt = (v) => (v === '' || v === undefined || v === null || isNaN(v) ? '--' : Math.round(Number(v) * 10) / 10);

const Sensor = ({ index = 0 }) => {
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [hasData, setHasData] = useState(false);
  const { actions } = useContext(Context);

  useEffect(() => {
    actions.getRoomSensor()
      .then((d) => {
        if (d && d.temp !== undefined && d.temp !== null) {
          setTemperature(d.temp);
          setHumidity(d.hum);
          setHasData(true);
        }
      })
      .catch(console.error);
  }, [actions]);

  // Live: the DHT11 board streams to topics `t` and `h` every ~10s.
  useMqtt((topic, payload) => {
    if (topic === 't') { setTemperature(payload); setHasData(true); }
    else if (topic === 'h') { setHumidity(payload); setHasData(true); }
  });

  if (!hasData) return null;

  return (
    <Card title="Living Room" icon={Home} index={index}>
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-inset flex items-center gap-3 p-4">
          <Thermometer size={26} className="text-accent" aria-hidden="true" />
          <div>
            <div className="text-2xl font-semibold tabular-nums">{fmt(temperature)}°</div>
            <div className="text-xs text-muted">Temp</div>
          </div>
        </div>
        <div className="glass-inset flex items-center gap-3 p-4">
          <Droplets size={26} className="text-sky-400" aria-hidden="true" />
          <div>
            <div className="text-2xl font-semibold tabular-nums">{fmt(humidity)}%</div>
            <div className="text-xs text-muted">Humidity</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Sensor;
