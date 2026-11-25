import type { Tutor } from "@/types";

/** Profile page: experience and certificates. Hidden when empty. */
export function Credentials({ tutor }: { tutor: Tutor }) {
  const { yearsExperience, studentsTaught, portfolioItems } = tutor;
  const hasStats = yearsExperience != null || studentsTaught != null;
  if (!hasStats && portfolioItems.length === 0) return null;

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
              <span>{yearsExperience === 1 ? "year of tutoring" : "years of tutoring"}</span>
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
