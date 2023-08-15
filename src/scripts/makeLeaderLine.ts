import { line_class } from "../@types/line_class";
import LeaderLine from "react-leader-line";

export default function makeLeaderLine(
  lines: line_class[],
  section = false,
  building = false
) {
  console.log(lines);
  console.log(section);

  if (
    !lines.some((l) => l.status == "Em aberto") &&
    lines.length > 0 &&
    !section &&
    building
  ) {
    console.log("codigo morto?");

    lines.forEach((line) => {
      line.sections.forEach((section) => {
        if (section.leaderLine._id) return;
        section.leaderLine = new LeaderLine(
          LeaderLine.pointAnchor(document.getElementById(section.startLine), {
            x: "50%",
            y: "50%",
          }),
          LeaderLine.pointAnchor(document.getElementById(section.endLine!), {
            x: "50%",
            y: "50%",
          }),
          {
            path: "straight",
            startPlug: "disc",
            endPlug: "disc",
            color: "red",
            size: 3,
            outline: true,
            outlineColor: "black",
          }
        );
      });
    });
  } else if (!building) {
    console.log('aqui')
    lines[lines.length - 1].sections.map((section) => {
      if (section.status === "moving") {
        section.leaderLine = new LeaderLine(
          LeaderLine.pointAnchor(document.getElementById(section.startLine), {
            x: "50%",
            y: "50%",
          }),
          LeaderLine.pointAnchor(document.getElementById(section.endLine!), {
            x: "50%",
            y: "50%",
          }),
          {
            path: "straight",
            startPlug: "disc",
            endPlug: "behind",
            color: "red",
            size: 3,
            outline: true,
            outlineColor: "black",
          }
        );
      } else if (section.status === "end") {
        section.leaderLine = new LeaderLine(
          LeaderLine.pointAnchor(document.getElementById(section.startLine), {
            x: "50%",
            y: "50%",
          }),
          LeaderLine.pointAnchor(document.getElementById(section.endLine!), {
            x: "50%",
            y: "50%",
          }),
          {
            path: "straight",
            startPlug: "disc",
            endPlug: "disc",
            color: "red",
            size: 3,
            outline: true,
            outlineColor: "black",
          }
        );
      }
    });
  }
}
