import type { Tutor } from "@/types";

/** Profile page: experience, own results, track record, certificates. Hidden when empty. */
export function Credentials({ tutor }: { tutor: Tutor }) {
  const { yearsExperience, studentsTaught, results, trackRecord, portfolioItems } = tutor;
  const hasStats = yearsExperience != null || studentsTaught != null;
  if (!hasStats && results.length === 0 && trackRecord.length === 0 && portfolioItems.length === 0) return null;

  return (
    <section className="tp-card">
      <div className="tp-card-head">
        <h2>Credentials</h2>
      </div>

      {hasStats && (
        <div className="cr-stats">
          {yearsExperience != null && (
            <div>
              <strong>{yearsExperience === 0 ? "<1" : yearsExperience}</strong>
              <span>{yearsExperience === 1 ? "year tutoring" : "years tutoring"}</span>
            </div>
          )}
          {studentsTaught != null && (
            <div>
              <strong>{studentsTaught}</strong>
              <span>{studentsTaught === 1 ? "student taught" : "students taught"}</span>
            </div>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div className="cr-block">
          <div className="cr-block-head">
            <span className="tp-sublabel">My own results</span>
            <span className="cr-note">Self-reported</span>
          </div>
          <table className="cr-results">
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td className="cr-exam">{r.exam}</td>
                  <td>
                    <span className="cr-exam-inline">{r.exam}</span>
                    {r.subject}
                  </td>
                  <td className="cr-grade">{r.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {trackRecord.length > 0 && (
        <div className="cr-block">
          <span className="tp-sublabel">Track record</span>
          <ul className="cr-track">
            {trackRecord.map((t, i) => (
              <li key={i}>
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M4 16l5-5 4 4 7-7M15 8h5v5" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {portfolioItems.length > 0 && (
        <div className="cr-block">
          <span className="tp-sublabel">Certificates and awards</span>
          <div className="tp-portfolio">
            {portfolioItems.map((item, i) => (
              <figure key={i}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.title} />
                </a>
                <figcaption>{item.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
