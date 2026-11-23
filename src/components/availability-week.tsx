import { DAYS_OF_WEEK } from "@/lib/constants";
import { TIME_BANDS, availabilityGrid } from "@/lib/availability";

/** Week at a glance: days across, morning / afternoon / evening down, free blocks shaded. */
export function AvailabilityWeek({ slots }: { slots: string[] }) {
  const grid = availabilityGrid(slots);
  return (
    <>
      <div className="ag-scroll">
        <div className="ag" role="table" aria-label="Weekly availability">
          <div role="row" className="ag-row">
            <span role="columnheader" />
            {DAYS_OF_WEEK.map((d) => (
              <span role="columnheader" key={d} className="ag-day">
                {d.slice(0, 3)}
              </span>
            ))}
          </div>
          {TIME_BANDS.map((b, i) => (
            <div role="row" className="ag-row" key={b.key}>
              <span role="rowheader" className="ag-band">
                <b>{b.label}</b>
                <small>{b.hours}</small>
              </span>
              {grid[i].map((on, d) => (
                <span
                  role="cell"
                  key={d}
                  className={on ? "ag-cell on" : "ag-cell"}
                  aria-label={`${DAYS_OF_WEEK[d]} ${b.label.toLowerCase()}: ${on ? "available" : "not available"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="ag-phone" role="table" aria-label="Weekly availability">
        <div role="row" className="ag-phone-row">
          <span role="columnheader" />
          {TIME_BANDS.map((b) => (
            <span role="columnheader" key={b.key} className="ag-day">
              {b.label}
            </span>
          ))}
        </div>
        {DAYS_OF_WEEK.map((d, di) => (
          <div role="row" className="ag-phone-row" key={d}>
            <span role="rowheader" className="ag-band">
              <b>{d.slice(0, 3)}</b>
            </span>
            {TIME_BANDS.map((b, bi) => (
              <span
                role="cell"
                key={b.key}
                className={grid[bi][di] ? "ag-cell on" : "ag-cell"}
                aria-label={`${d} ${b.label.toLowerCase()}: ${grid[bi][di] ? "available" : "not available"}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="ag-legend">
        <span>
          <i className="ag-swatch on" />
          Available
        </span>
        <span>
          <i className="ag-swatch" />
          Not available
        </span>
      </div>
    </>
  );
}
