import React, { CSSProperties } from "react";
import mockCues from "../data/mockCues";
import "./Timeline.css";
import { Cue } from "../types/subtitles";

const TimelineCue: React.FC<{ cue: Cue }> = ({ cue }) => (
  <div
    className="timeline-cue"
    style={
      {
        "--cue-start": cue.start,
        "--cue-end": cue.end,
        "--cue-duration": cue.end - cue.start,
      } as CSSProperties
    }
  >
    <span className="timeline-cue__first-line" title={cue.lines.join("\n")}>
      {cue.lines[0] || <em>Blank</em>}
    </span>
  </div>
);

const Timeline: React.FC<{ duration: number }> = ({ duration }) => (
  <div className="timeline">
    <div className="timeline__bumper" />
    <section
      className="timeline__content"
      style={
        {
          "--timeline-duration": duration,
          "--timeline-scale": 0.1,
        } as CSSProperties
      }
    >
      {mockCues.map((cue) => (
        <TimelineCue key={cue.id} cue={cue} />
      ))}
    </section>
    <div className="timeline__bumper" />
  </div>
);

export default Timeline;
