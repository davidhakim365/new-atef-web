import { useEffect, useRef } from "react";
import "./courses-background.css";

const CoursesBackground = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
      // Trigger animation after a slight delay to ensure DOM is ready
      setTimeout(() => {
         svg.classList.add("animated");
      }, 100);
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      className="h-full"
      id="freepik_stories-science"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
    >
       <g
      style={{
        transformOrigin: "259px 259.521px 0",
      }}
      className="animable"
    >
      <path
        d="M61.16 317.86s6.94 59.24 57.59 84.64 100.17.89 145.66-4.95c23.83-3.06 45.95 8.64 69.32 11.12 74.72 7.95 133.18-79.5 122.53-143.94-9.21-55.79-45.12-95.22-110.46-123.44S235.52 90.64 159.74 116.9 55.6 241.16 61.16 317.86Z"
        style={{
          fill: "#92e3a9",
          transformOrigin: "259px 259.521px 0",
        }}
        className="animable"
      />
      <path
        d="M61.16 317.86s6.94 59.24 57.59 84.64 100.17.89 145.66-4.95c23.83-3.06 45.95 8.64 69.32 11.12 74.72 7.95 133.18-79.5 122.53-143.94-9.21-55.79-45.12-95.22-110.46-123.44S235.52 90.64 159.74 116.9 55.6 241.16 61.16 317.86Z"
        style={{
          fill: "#fff",
          opacity: 0.7,
          transformOrigin: "259px 259.521px 0",
        }}
        className="animable"
      />
    </g>
    <g
      style={{
        transformOrigin: "271.11px 262.16px 0",
      }}
      className="animable"
    >
      <path
        d="M134 207.57a3.87 3.87 0 1 0-3.87 3.88 3.87 3.87 0 0 0 3.87-3.88Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "130.13px 207.58px 0",
        }}
        className="animable"
      />
      <path
        d="M163.35 207.57a3.88 3.88 0 1 0-3.87 3.88 3.87 3.87 0 0 0 3.87-3.88Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "159.47px 207.57px 0",
        }}
        className="animable"
      />
      <path
        d="M148.08 224.8a3.88 3.88 0 1 0-3.87 3.88 3.87 3.87 0 0 0 3.87-3.88Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "144.2px 224.8px 0",
        }}
        className="animable"
      />
      <path
        d="M175.1 224.8a3.88 3.88 0 1 0-3.88 3.88 3.88 3.88 0 0 0 3.88-3.88Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "171.22px 224.8px 0",
        }}
        className="animable"
      />
      <path
        d="M175.1 251.43a3.88 3.88 0 1 0-3.88 3.87 3.88 3.88 0 0 0 3.88-3.87Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "171.22px 251.42px 0",
        }}
        className="animable"
      />
      <path
        d="M120.22 251.43a3.88 3.88 0 1 0-3.87 3.87 3.88 3.88 0 0 0 3.87-3.87Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "116.34px 251.42px 0",
        }}
        className="animable"
      />
      <path
        d="M199.77 224.8a3.88 3.88 0 1 0-3.88 3.88 3.88 3.88 0 0 0 3.88-3.88Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "195.89px 224.8px 0",
        }}
        className="animable"
      />
      <path
        d="M199.77 250.25a3.88 3.88 0 1 0-3.88 3.88 3.88 3.88 0 0 0 3.88-3.88Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "195.89px 250.25px 0",
        }}
        className="animable"
      />
      <path
        d="M199.77 291.08a3.88 3.88 0 1 0-3.88 3.87 3.88 3.88 0 0 0 3.88-3.87Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "195.89px 291.07px 0",
        }}
        className="animable"
      />
      <path
        style={{
          fill: "#c9c9c9",
          transformOrigin: "162.445px 228.485px 0",
        }}
        className="animable"
        d="m196.54 250.4-1.95-.43.3-1.39V225.8h-51.16L128 206.57h31.48v2h-27.26l12.46 15.23h52.21l-.02 25.1-.33 1.5z"
      />
      <path
        style={{
          fill: "#c9c9c9",
          transformOrigin: "145.705px 258.585px 0",
        }}
        className="animable"
        d="M197.68 292.37H93.73v-2h101.95v-37.94h-25.46V224.8h2v25.63h25.46v41.94z"
      />
      <path
        style={{
          fill: "#c9c9c9",
          transformOrigin: "143.11px 270.9px 0",
        }}
        className="animable"
        d="M117 291.37h-2v-40.94h56.22v2H117v38.94z"
      />
      <path
        style={{
          fill: "#c9c9c9",
          transformOrigin: "380.665px 298.995px 0",
        }}
        className="animable"
        d="M303 294.33h155.33v9.33H303z"
      />
      <path
        style={{
          fill: "#c9c9c9",
          transformOrigin: "412.77px 344.375px 0",
        }}
        className="animable"
        d="M409.28 299.45h6.98v89.85h-6.98z"
      />
      <path
        style={{
          fill: "#c9c9c9",
          transformOrigin: "161.555px 298.995px 0",
        }}
        className="animable"
        d="M83.89 294.33h155.33v9.33H83.89z"
      />
      <path
        style={{
          fill: "#c9c9c9",
          transformOrigin: "193.66px 344.375px 0",
        }}
        className="animable"
        d="M190.17 299.45h6.98v89.85h-6.98z"
      />
      <path
        style={{
          fill: "#c9c9c9",
          transformOrigin: "101.81px 344.375px 0",
        }}
        className="animable"
        d="M98.32 299.45h6.98v89.85h-6.98z"
      />
      <path
        d="M383.17 288.87 373 270.77v-12.44a1.72 1.72 0 0 0-.62-3.32h-10.64a1.72 1.72 0 0 0-.62 3.32v12L350.91 289a4.65 4.65 0 0 0 4.14 6.78h24a4.66 4.66 0 0 0 4.12-6.91Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "367.071px 275.395px 0",
        }}
        className="animable"
      />
      <path
        d="m332.42 288.87-10.18-18.1v-12.44a1.72 1.72 0 0 0-.62-3.32H311a1.72 1.72 0 0 0-.63 3.32v12L300.15 289a4.65 4.65 0 0 0 4.14 6.78h24a4.66 4.66 0 0 0 4.13-6.91Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "316.316px 275.395px 0",
        }}
        className="animable"
      />
      <path
        d="M367.59 260.3h-.18a1 1 0 0 1-.84-1.2c1-5.86-2-13-7.62-17.85-5.29-4.59-11.66-6.12-17.48-4.22a11.38 11.38 0 0 0-6.14 4.81h.35c6.49-.82 9.3 1.5 10.51 3.59 1.68 2.91 1.16 7.2-1.28 10.42-2 2.66-4.8 3.84-7.49 3.17-3.72-.94-6.13-4.5-6.3-9.28a15.93 15.93 0 0 1 .67-5c-11.68 3.19-13.06 12.23-13.12 12.65a1 1 0 0 1-2.05-.27c0-.12 1.68-11.55 16.08-14.74a13.72 13.72 0 0 1 8.13-7.26c6.52-2.13 13.62-.45 19.48 4.63 6.2 5.36 9.46 13.12 8.3 19.77a1 1 0 0 1-1.02.78Zm-33.42-16.18a13.91 13.91 0 0 0-1 5.5c.1 3 1.4 6.49 4.73 7.33 2.66.67 4.61-1.45 5.32-2.4 1.65-2.18 2.57-5.67 1.14-8.13-1.28-2.22-4.21-3.11-8.45-2.57q-.91.15-1.74.27Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "342.726px 247.259px 0",
        }}
        className="animable"
      />
      <path
        d="M213.05 387.28a1.5 1.5 0 0 1-1.5-1.5V136.52a1.5 1.5 0 0 1 3 0v249.26a1.5 1.5 0 0 1-1.5 1.5Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "213.05px 261.15px 0",
        }}
        className="animable"
      />
      <path
        d="M226.43 194.89a6.43 6.43 0 0 1-6.42-6.41v-25.89h-6.11a1.5 1.5 0 0 1 0-3h7.61a1.5 1.5 0 0 1 1.5 1.5v27.39a3.42 3.42 0 0 0 6.83 0v-27.36a1.5 1.5 0 0 1 1.5-1.5h9.13a1.5 1.5 0 1 1 0 3h-7.63v25.86a6.42 6.42 0 0 1-6.41 6.41Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "227.185px 177.24px 0",
        }}
        className="animable"
      />
      <path
        d="M247.32 194.89a6.42 6.42 0 0 1-6.41-6.41v-25.89h-6.11a1.5 1.5 0 0 1 0-3h7.61a1.5 1.5 0 0 1 1.5 1.5v27.39a3.42 3.42 0 0 0 6.83 0v-27.36a1.5 1.5 0 0 1 1.5-1.5h9.13a1.5 1.5 0 0 1 0 3h-7.63v25.86a6.43 6.43 0 0 1-6.42 6.41Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "248.085px 177.24px 0",
        }}
        className="animable"
      />
      <path
        d="M268.22 194.89a6.42 6.42 0 0 1-6.41-6.41v-25.89h-6.11a1.5 1.5 0 0 1 0-3h7.61a1.5 1.5 0 0 1 1.5 1.5v27.39a3.42 3.42 0 0 0 6.83 0v-27.36a1.5 1.5 0 0 1 1.5-1.5h9.13a1.5 1.5 0 0 1 0 3h-7.63v25.86a6.43 6.43 0 0 1-6.42 6.41Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "268.985px 177.24px 0",
        }}
        className="animable"
      />
      <path
        d="M289.12 194.89a6.42 6.42 0 0 1-6.41-6.41v-25.89h-6.11a1.5 1.5 0 0 1 0-3h7.61a1.5 1.5 0 0 1 1.5 1.5v27.39a3.42 3.42 0 0 0 6.83 0v-27.36a1.5 1.5 0 0 1 1.5-1.5h39.71a1.5 1.5 0 0 1 0 3h-38.21v25.86a6.43 6.43 0 0 1-6.42 6.41Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "305.175px 177.24px 0",
        }}
        className="animable"
      />
      <path
        d="M330.17 175.34V156.9h.06a1.91 1.91 0 0 0 0-3.81h-12.09a1.91 1.91 0 0 0 0 3.81h.06v18.44a20.74 20.74 0 1 0 12 0Z"
        style={{
          fill: "#c9c9c9",
          transformOrigin: "324.2px 184.512px 0",
        }}
        className="animable"
      />
    </g>
    <g
      style={{
        transformOrigin: "140.175px 335.65px 0",
      }}
      className="animable"
    >
      <path
        d="m124.31 362.38-11.19 18a3.45 3.45 0 0 0 2.93 5.27h22.86a3.45 3.45 0 0 1-2.94-5.26l10.83-17.64Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "129.7px 374.015px 0",
        }}
        className="animable"
      />
      <rect
        x={90.56}
        y={285.65}
        width={95.61}
        height={80.75}
        rx={2.91}
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "138.365px 326.025px 0",
        }}
        className="animable"
      />
      <rect
        x={94.18}
        y={285.65}
        width={95.61}
        height={80.75}
        rx={2.91}
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "141.985px 326.025px 0",
        }}
        className="animable"
      />
      <path
        d="M186.58 285.65H97.39a3.21 3.21 0 0 0-3.21 3.21v63.07h95.61v-63.07a3.21 3.21 0 0 0-3.21-3.21Z"
        style={{
          fill: "#263238",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "141.985px 318.79px 0",
        }}
        className="animable"
      />
      <path
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "141.99px 318.185px 0",
        }}
        className="animable"
        d="M98.2 288.86h87.58v58.65H98.2z"
      />
      <path
        style={{
          fill: "#92e3a9",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "164.675px 304.76px 0",
        }}
        className="animable"
        d="M175.75 311.15v-12.79l-11.07-6.39-11.08 6.39v12.79l11.08 6.4 11.07-6.4z"
      />
      <path
        style={{
          fill: "#92e3a9",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "135.11px 317.81px 0",
        }}
        className="animable"
        d="M144.16 323.04v-10.46l-9.05-5.22-9.05 5.22v10.46l9.05 5.22 9.05-5.22z"
      />
      <path
        style={{
          fill: "#92e3a9",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "124.37px 301.43px 0",
        }}
        className="animable"
        d="M133.42 306.66v-10.45l-9.05-5.23-9.05 5.23v10.45l9.05 5.22 9.05-5.22z"
      />
      <path
        style={{
          fill: "#92e3a9",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "124.37px 333.92px 0",
        }}
        className="animable"
        d="M133.42 339.14v-10.45l-9.05-5.22-9.05 5.22v10.45l9.05 5.23 9.05-5.23z"
      />
      <path
        style={{
          fill: "#92e3a9",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "113.37px 317.81px 0",
        }}
        className="animable"
        d="M122.42 323.04v-10.46l-9.05-5.22-9.05 5.22v10.46l9.05 5.22 9.05-5.22z"
      />
      <path
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "164.695px 324.19px 0",
        }}
        className="animable"
        d="M155 324.19h19.39"
      />
      <path
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "164.695px 328.14px 0",
        }}
        className="animable"
        d="M155 328.14h19.39"
      />
      <path
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "164.695px 332.08px 0",
        }}
        className="animable"
        d="M155 332.08h19.39"
      />
    </g>
    <g
      style={{
        transformOrigin: "312.06px 294.045px 0",
      }}
      className="animable"
    >
      <path
        d="m427.58 218.55-49.5.41s-3.28-.41-4.09 2c0 0-8.6 21.68-9 29.46s1.64 6.54-1.63 16.77-12.69 34.37-18 54c-5.73 21.14-8.06 43.31-9 65.3h62.29c.07-21.08 1.45-42 8.9-62.85 5.39-15.12 11.59-31.08 16.17-46.9s5.38-32.25 8.37-48.43c2.04-10.98-4.51-9.76-4.51-9.76Z"
        style={{
          fill: "#263238",
          transformOrigin: "384.422px 302.5px 0",
        }}
        className="animable"
      />
      <path
        d="M432.43 223.45c-.49-5.71-4.85-4.9-4.85-4.9l-49.5.41s-3.28-.41-4.09 2c0 0-8.6 21.68-9 29.46a37.89 37.89 0 0 0 .18 6.16l1 1.61s1.64 14.32 21.28 15.14 30.68-8.19 34.77-16.78 5.73-22.5 9-30.68a24.94 24.94 0 0 1 1.21-2.42Z"
        style={{
          fill: "#6e6e6e",
          transformOrigin: "398.684px 245.946px 0",
        }}
        className="animable"
      />
      <path
        d="m429.64 218.79-.05.06a88.62 88.62 0 0 0-8.59 20.59c-3.32 11.95-1.33 15.27-4.65 35.85s-15.35 43.83-19.96 65.08c-2 9-2.74 27.5-2.94 46.18h5.19c.07-21.08 1.45-42 8.9-62.85 5.39-15.12 11.59-31.08 16.17-46.9s5.38-32.25 8.37-48.43c1.26-6.79-.72-8.93-2.44-9.58Z"
        style={{
          fill: "#6e6e6e",
          transformOrigin: "412.964px 302.67px 0",
        }}
        className="animable"
      />
      <path
        d="M241.19 292.45s-3.66-7-4.32-11.31-3.66-17-6.33-23-15.64-13.64-18-13.31-7.32 13-7 18.31 6.33 12.31 8 14.64 5.66 15 8.32 19 3 5.66 3 5.66Z"
        style={{
          fill: "#92e3a9",
          transformOrigin: "223.358px 273.63px 0",
        }}
        className="animable"
      />
      <g
        style={{
          clipPath: "url(#a)",
          transformOrigin: "222.745px 288.572px 0",
        }}
        className="animable"
      >
        <path
          d="M228.11 285c.66-3-3.67-1-5.67-2.67s.33-2.33 1-4.66-7 2.33-8.33 2a3.89 3.89 0 0 1-.71-.32c1.93 4.17 5.2 14 7.49 17.43.93 1.4 1.57 2.5 2 3.35l7.2-1.8S227.44 288 228.11 285Z"
          style={{
            opacity: 0.3,
            transformOrigin: "222.745px 288.572px 0",
          }}
          className="animable"
        />
      </g>
      <path
        d="M241.19 292.45s-3.66-7-4.32-11.31-3.66-17-6.33-23-15.64-13.64-18-13.31-7.32 13-7 18.31 6.33 12.31 8 14.64 5.66 15 8.32 19 3 5.66 3 5.66Z"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "223.358px 273.63px 0",
        }}
        className="animable"
      />
      <path
        d="M210.24 259.84s-10-2.66-12.64-2-1.34 4 2.33 5a16.09 16.09 0 0 1 5.51 2.5l3.33 5"
        style={{
          fill: "#92e3a9",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "203.224px 264.037px 0",
        }}
        className="animable"
      />
      <path
        d="M212.57 240.54h8v32.73a3.22 3.22 0 0 1-3.22 3.22h-1.55a3.22 3.22 0 0 1-3.22-3.22v-32.73h-.01Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "216.57px 258.515px 0",
        }}
        className="animable"
      />
      <path
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "216.56px 240.7px 0",
        }}
        className="animable"
        d="M211.07 239.2h10.98v3h-10.98z"
      />
      <path
        d="M211.07 239.2s-4.49-1-4.49 3.33 3.33 5.33 6 2.33.99-5.99-1.51-5.66Z"
        style={{
          fill: "#92e3a9",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "210.259px 242.842px 0",
        }}
        className="animable"
      />
      <path
        d="M234.2 268.82s-2.66-12.31-4.65-17.3-7.66-9.65-9-11-2.66 4-1.66 5.65 3 5.66 3 5.66-3.33 14.31 1 17.64"
        style={{
          fill: "#92e3a9",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "226.369px 254.887px 0",
        }}
        className="animable"
      />
      <path
        d="M211.24 253.18s-6.66-.66-7.32 1.67.66 3.66 2.66 3.66 7 1 7.32-1.33-.33-4.33-2.66-4Z"
        style={{
          fill: "#92e3a9",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "208.862px 255.909px 0",
        }}
        className="animable"
      />
      <path
        d="M211.91 247.52s-6.66-.66-7.33 1.67.67 3.66 2.67 3.66 7 1 7.32-1.33-.33-4.33-2.66-4Z"
        style={{
          fill: "#92e3a9",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "209.526px 250.249px 0",
        }}
        className="animable"
      />
      <path
        d="m240.53 288.13-19.64 11.64s7.32 13.32 11.32 24.63 12 32.62 25.29 32.28 25.63-17.3 25.63-17.3l-15.31-44.6-13.65 18.64Z"
        style={{
          fill: "#fff",
          transformOrigin: "252.01px 322.407px 0",
        }}
        className="animable"
      />
      <g
        style={{
          clipPath: "url(#b)",
          transformOrigin: "252.01px 322.407px 0",
        }}
        className="animable"
      >
        <path
          d="m240.53 288.13-19.64 11.64s7.32 13.32 11.32 24.63 12 32.62 25.29 32.28 25.63-17.3 25.63-17.3l-15.31-44.6-13.65 18.64Z"
          style={{
            fill: "#92e3a9",
            stroke: "#263238",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            transformOrigin: "252.01px 322.407px 0",
          }}
          className="animable"
        />
        <path
          d="m240.53 288.13-19.64 11.64s7.32 13.32 11.32 24.63 12 32.62 25.29 32.28 25.63-17.3 25.63-17.3l-15.31-44.6-13.65 18.64Z"
          style={{
            fill: "#fff",
            opacity: 0.5,
            transformOrigin: "252.01px 322.407px 0",
          }}
          className="animable"
        />
      </g>
      <path
        d="m240.53 288.13-19.64 11.64s7.32 13.32 11.32 24.63 12 32.62 25.29 32.28 25.63-17.3 25.63-17.3l-15.31-44.6-13.65 18.64Z"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "252.01px 322.407px 0",
        }}
        className="animable"
      />
      <path
        d="M303.71 254.8s15.55 2.78 24.54 7.1 21.44 12.58 26.76 29.22 2.66 95.29 2.66 95.29h-82.53s4-34.39.33-50-7.68-15.75-9.86-27.2c-6.5-34.03 11.81-58.07 38.1-54.41Z"
        style={{
          fill: "#fff",
          transformOrigin: "311.314px 320.421px 0",
        }}
        className="animable"
      />
      <g
        style={{
          clipPath: "url(#c)",
          transformOrigin: "302.701px 327.925px 0",
        }}
        className="animable"
      >
        <path
          d="M329.28 387c4.43-11.67 11.83-39.3 11.83-39.3s-25.67-6.34-29.34-18 4.34-36.7 4.34-36.7-19.34 30-22 34.67S276.77 281 271.77 269a1 1 0 0 0-.07-.15c-6.56 9.78-9.24 23.88-6.09 40.33 2.18 11.45 6.2 11.56 9.86 27.2s-.33 50.59-.33 50.59Z"
          style={{
            fill: "#92e3a9",
            transformOrigin: "302.701px 327.925px 0",
          }}
          className="animable"
        />
        <path
          d="M329.28 387c4.43-11.67 11.83-39.3 11.83-39.3s-25.67-6.34-29.34-18 4.34-36.7 4.34-36.7-19.34 30-22 34.67S276.77 281 271.77 269a1 1 0 0 0-.07-.15c-6.56 9.78-9.24 23.88-6.09 40.33 2.18 11.45 6.2 11.56 9.86 27.2s-.33 50.59-.33 50.59Z"
          style={{
            fill: "#fff",
            opacity: 0.5,
            transformOrigin: "302.701px 327.925px 0",
          }}
          className="animable"
        />
      </g>
      <path
        d="M303.71 254.8s15.55 2.78 24.54 7.1 21.44 12.58 26.76 29.22 2.66 95.29 2.66 95.29h-82.53s4-34.39.33-50-7.68-15.75-9.86-27.2c-6.5-34.03 11.81-58.07 38.1-54.41Z"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "311.314px 320.421px 0",
        }}
        className="animable"
      />
      <path
        d="m269.33 296.62 3.33 2.21-2.59 5.55s3 10.35 6.28 16.63 6.65 11.83 6.65 11.83 10.72-11.83 15.52-19.22 9.25-16.26 9.25-16.26l-4.44-3.7 9.24-5.92s3.5-19.26 2-30.52c-5.91-1.54-10.85-2.42-10.85-2.42-15.41-2.15-26.22 3.62-32.6 11.09L269.7 270a57.81 57.81 0 0 0-1.48 14.79 114.43 114.43 0 0 0 1.11 11.83Z"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "291.57px 293.593px 0",
        }}
        className="animable"
      />
      <path
        d="M273.59 272.52s-.36 17.72 1.41 26.94 8.51 23.39 8.51 23.39 11-21.62 15.6-33.67 4.6-34.38 4.6-34.38l-24.81-2.13Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "288.635px 287.76px 0",
        }}
        className="animable"
      />
      <path
        style={{
          fill: "#263238",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "283.975px 302.83px 0",
        }}
        className="animable"
        d="m276.94 293.55 4.97 7.86-2.48 11.17 4.08 10.28 4.19-10.28-1.65-10.75 4.96-10.35-7.86-8.68-6.21 10.75z"
      />
      <path
        d="m283.09 291.64 12 8s8-18.25 9-28.17a58.56 58.56 0 0 0-.36-16.66L287.76 253l-14.17 19.49 1.41 26.97Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "289.055px 276.32px 0",
        }}
        className="animable"
      />
      <path
        d="m267.21 273.23 15.88 18.41 10-34-5.32-15.95s-3.54 15.6-9.92 20.92a82.83 82.83 0 0 0-10.64 10.62Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "280.15px 266.665px 0",
        }}
        className="animable"
      />
      <path
        d="m235.06 342.83-13.48-24v-16.47a2.27 2.27 0 0 0-.83-4.39h-14.08a2.27 2.27 0 0 0-.83 4.39v15.9h0l-13.51 24.67a6.16 6.16 0 0 0 5.49 9h31.82a6.17 6.17 0 0 0 5.42-9.1Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "213.718px 324.95px 0",
        }}
        className="animable"
      />
      <path
        d="M227.49 334.28c-5.21 1.63-11.64 2.55-16.89-.07a27.19 27.19 0 0 0-9.1-3l-5.65 10.31a5.15 5.15 0 0 0 4.58 7.49H227a5.15 5.15 0 0 0 4.54-7.57Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "213.716px 340.11px 0",
        }}
        className="animable"
      />
      <path
        d="m235.06 342.83-13.48-24v-16.47a2.27 2.27 0 0 0-.83-4.39h-14.08a2.27 2.27 0 0 0-.83 4.39v15.9h0l-13.51 24.67a6.16 6.16 0 0 0 5.49 9h31.82a6.17 6.17 0 0 0 5.42-9.1Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "213.718px 324.95px 0",
        }}
        className="animable"
      />
      <path
        d="M227.49 334.28c-5.21 1.63-11.64 2.55-16.89-.07a27.19 27.19 0 0 0-9.1-3l-5.65 10.31a5.15 5.15 0 0 0 4.58 7.49H227a5.15 5.15 0 0 0 4.54-7.57Z"
        style={{
          fill: "#263238",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "213.716px 340.11px 0",
        }}
        className="animable"
      />
      <path
        d="m259.5 332.72-10.65-10.31s-.67-4-2-5a42.67 42.67 0 0 1-3.33-3s-8-16-11.31-20.64a12.9 12.9 0 0 0-11.32-5.65c-3 .33-16 1.33-17.3 4.32-.41.92 1.33 3.66 1.33 3.66s-3.33 1.67-2.66 4.66 2 3.33 2 3.33-4 3-2.66 5.33a5.21 5.21 0 0 0 3.33 2.66s-2.66 3 .33 4a61.81 61.81 0 0 0 6.32 1.67s3.66 9.31 7 9.65a60.54 60.54 0 0 1 7.32 1.33s6.66 13.64 12 20 15 7 15 7Z"
        style={{
          fill: "#92e3a9",
          transformOrigin: "230.413px 321.917px 0",
        }}
        className="animable"
      />
      <g
        style={{
          clipPath: "url(#d)",
          transformOrigin: "227.215px 335.265px 0",
        }}
        className="animable"
      >
        <path
          d="M234.77 335.33c-1 0-.66-3 .34-5.33s-2.34 0-3.34-.67 0 0 0-3.66-5.33-1-9.33-1.67-7-8-7-8l-10.19.08a61.81 61.81 0 0 0 6.32 1.67s3.66 9.31 7 9.65a60.54 60.54 0 0 1 7.32 1.33s6.66 13.64 12 20a19.93 19.93 0 0 0 9.29 5.8c1.18-2.45 2-4.5 2-4.5s-13.41-14.7-14.41-14.7Z"
          style={{
            opacity: 0.3,
            transformOrigin: "227.215px 335.265px 0",
          }}
          className="animable"
        />
      </g>
      <path
        d="m259.5 332.72-10.65-10.31s-.67-4-2-5a42.67 42.67 0 0 1-3.33-3s-8-16-11.31-20.64a12.9 12.9 0 0 0-11.32-5.65c-3 .33-16 1.33-17.3 4.32-.41.92 1.33 3.66 1.33 3.66s-3.33 1.67-2.66 4.66 2 3.33 2 3.33-4 3-2.66 5.33a5.21 5.21 0 0 0 3.33 2.66s-2.66 3 .33 4a61.81 61.81 0 0 0 6.32 1.67s3.66 9.31 7 9.65a60.54 60.54 0 0 1 7.32 1.33s6.66 13.64 12 20 15 7 15 7Z"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "230.413px 321.917px 0",
        }}
        className="animable"
      />
      <path
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "210.91px 295.78px 0",
        }}
        className="animable"
        d="m204.92 296.11 11.98-.66"
      />
      <path
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "209.075px 303.77px 0",
        }}
        className="animable"
        d="m204.25 304.1 9.65-.66"
      />
      <path
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "208.58px 311.755px 0",
        }}
        className="animable"
        d="m204.92 312.09 7.32-.67"
      />
      <path
        d="M321.73 275.48s-5.32 11.65-6.32 21-13.64 45.09-13.64 45.09-25.63-7.15-32.95-9.15a64.88 64.88 0 0 1-14.22-6.15l-14.89 26.89s41.43 24.21 60.06 27.2 21.68 3.64 30.67-4.36 22.91-61.25 22.91-61.25"
        style={{
          fill: "#fff",
          transformOrigin: "296.53px 328.951px 0",
        }}
        className="animable"
      />
      <g
        style={{
          clipPath: "url(#e)",
          transformOrigin: "294.075px 357.242px 0",
        }}
        className="animable"
      >
        <path
          d="M323.77 368.67c-6.33 2-5-11-10-13s3.67 14-1.33 16.33-15.33-2.67-26-6.33c-8.2-2.82-32.32-14.09-43.06-19.17l-3.67 6.63s41.43 24.21 60.06 27.2 21.68 3.67 30.67-4.33c5.61-5 13.14-27.62 18-43.92-4.05 1.97-19.06 34.82-24.67 36.59Z"
          style={{
            fill: "#92e3a9",
            transformOrigin: "294.075px 357.242px 0",
          }}
          className="animable"
        />
        <path
          d="M323.77 368.67c-6.33 2-5-11-10-13s3.67 14-1.33 16.33-15.33-2.67-26-6.33c-8.2-2.82-32.32-14.09-43.06-19.17l-3.67 6.63s41.43 24.21 60.06 27.2 21.68 3.67 30.67-4.33c5.61-5 13.14-27.62 18-43.92-4.05 1.97-19.06 34.82-24.67 36.59Z"
          style={{
            fill: "#fff",
            opacity: 0.5,
            transformOrigin: "294.075px 357.242px 0",
          }}
          className="animable"
        />
      </g>
      <path
        d="M321.73 275.48s-5.32 11.65-6.32 21-13.64 45.09-13.64 45.09-25.63-7.15-32.95-9.15a64.88 64.88 0 0 1-14.22-6.15l-14.89 26.89s41.43 24.21 60.06 27.2 21.68 3.64 30.67-4.36 22.91-61.25 22.91-61.25"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "296.53px 328.951px 0",
        }}
        className="animable"
      />
      <path
        d="M247.71 223.25s-1.77 14.18 1.06 26.94 8.16 29.07 12.06 29.42 24.1-13.11 25.52-19.85 1.41-9.57 1.41-18.08a166 166 0 0 0-1.06-20.91c-.71-5.32-3.9-11-13.47-9.57s-21.98 5.32-25.52 12.05Z"
        style={{
          fill: "#fff",
          transformOrigin: "267.468px 245.296px 0",
        }}
        className="animable"
      />
      <g
        style={{
          clipPath: "url(#f)",
          transformOrigin: "262.857px 245.012px 0",
        }}
        className="animable"
      >
        <path
          d="M273.23 211.2c-9.57 1.42-22 5.32-25.52 12.05 0 0-1.77 14.18 1.06 26.94 2.56 11.49 7.12 25.84 10.85 28.85-1.49-7.62-4.6-22.71-5.85-22.71-1.66 0-3-2-3.93-2.95s4.6-8 4.6-8l-.67-18.38 24.78-8.71-.65-7.19a16.87 16.87 0 0 0-4.67.1Z"
          style={{
            fill: "#92e3a9",
            transformOrigin: "262.857px 245.012px 0",
          }}
          className="animable"
        />
        <path
          d="M273.23 211.2c-9.57 1.42-22 5.32-25.52 12.05 0 0-1.77 14.18 1.06 26.94 2.56 11.49 7.12 25.84 10.85 28.85-1.49-7.62-4.6-22.71-5.85-22.71-1.66 0-3-2-3.93-2.95s4.6-8 4.6-8l-.67-18.38 24.78-8.71-.65-7.19a16.87 16.87 0 0 0-4.67.1Z"
          style={{
            fill: "#fff",
            opacity: 0.5,
            transformOrigin: "262.857px 245.012px 0",
          }}
          className="animable"
        />
      </g>
      <path
        d="M247.71 223.25s-1.77 14.18 1.06 26.94 8.16 29.07 12.06 29.42 24.1-13.11 25.52-19.85 1.41-9.57 1.41-18.08a166 166 0 0 0-1.06-20.91c-.71-5.32-3.9-11-13.47-9.57s-21.98 5.32-25.52 12.05Z"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "267.468px 245.296px 0",
        }}
        className="animable"
      />
      <path
        d="M267.91 201.28c-11.69 1.41-26.23 10.28-32.61 16.3s11.35 2.13 11.35 2.13l-5 8.86s7.45-2.84 13.83-5.67 23-4.61 23-4.61l-7.09 7.8 10.63 2.13s-1.64 6.59-.1 8.4c-.16 7.48-.58 17.5-1.67 19.24-1.77 2.84-5 2.84-17 1.77-10-.88-11.7 1.64-12 2.54 2.87 10 6.59 19.18 9.51 19.44 3.89.36 24.1-13.11 25.52-19.85s1.41-9.57 1.41-18.08c0-2.81 0-5.44-.12-7.92.48-.54.88-.94 1.19-.94 1.06 0 3.19 1.42 3.19 1.42s1.77-12.76 1.77-20.2-14.11-14.18-25.81-12.76Z"
        style={{
          fill: "#263238",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "263.817px 240.353px 0",
        }}
        className="animable"
      />
      <path
        style={{
          fill: "none",
          stroke: "#fff",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "259.405px 263.84px 0",
        }}
        className="animable"
        d="m255.86 264.37 7.09-1.06"
      />
      <path
        d="M253.38 246.65s-4.61 7.44-2.83 8.86 7.79 1.06 7.79 1.06"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "254.241px 251.63px 0",
        }}
        className="animable"
      />
      <path
        d="M245.94 239.2s-2.84 3.9-2.84 6.38 6.74 7.8 6.74 7.8 2.12-8.15 5-6.38 3.54 5 6.73 5 13.47-2.48 15.25-5.67 2.48-9.21 2.48-9.21l10.63-2.48-.35-3.19Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "266.515px 242.415px 0",
        }}
        className="animable"
      />
      <path
        d="m289.54 231.41-43.25 6s-2.48 1.77-.35 1.77 43.6-7.77 43.6-7.77Z"
        style={{
          fill: "#263238",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "267.308px 235.295px 0",
        }}
        className="animable"
      />
      <ellipse
        cx={261.88}
        cy={243.44}
        rx={0.95}
        ry={2.18}
        style={{
          fill: "#263238",
          transformOrigin: "261.88px 243.44px 0",
        }}
        className="animable"
      />
      <ellipse
        cx={251.54}
        cy={244.16}
        rx={0.95}
        ry={2.18}
        style={{
          fill: "#263238",
          transformOrigin: "251.54px 244.16px 0",
        }}
        className="animable"
      />
      <path
        d="M259 233.39s1.74-3.64 6.84-2.91"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "262.42px 231.887px 0",
        }}
        className="animable"
      />
      <path
        d="M252.92 234.41a4.69 4.69 0 0 0-4.8.15"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "250.52px 234.191px 0",
        }}
        className="animable"
      />
      <path
        d="M284.93 239.91s0-12.76 5.31-11 2.49 13.83 1.42 16.31-5.67 2.13-5.67 2.13"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "289.15px 238.055px 0",
        }}
        className="animable"
      />
      <path
        d="M291.73 233.43a1.93 1.93 0 0 0-2.9-.61c-1.9 1.25-.64 5.68-.64 5.68s2.7-.51 2.36 1.52-1.55 1.68-1.55 1.68"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "289.755px 237.064px 0",
        }}
        className="animable"
      />
    </g>
    <g
      style={{
        transformOrigin: "255.67px 386.58px 0",
      }}
      className="animable"
    >
      <path
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "255.67px 386.58px 0",
        }}
        className="animable"
        d="M440.65 386.58H70.69"
      />
    </g>
    <g
      style={{
        transformOrigin: "241.93px 312.88px 0",
      }}
      className="animable"
    >
      <path
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "385.76px 377.54px 0",
        }}
        className="animable"
        d="M355.27 358.57h60.98v37.94h-60.98z"
      />
      <path
        d="M390 349.69h8.71v35.69a3.51 3.51 0 0 1-3.51 3.51h-1.69a3.51 3.51 0 0 1-3.51-3.51v-35.69Z"
        style={{
          fill: "#fff",
          transformOrigin: "394.355px 369.29px 0",
        }}
        className="animable"
      />
      <g
        style={{
          clipPath: "url(#g)",
          transformOrigin: "394.36px 377.25px 0",
        }}
        className="animable"
      >
        <path
          d="M393.52 388.89h1.7a3.51 3.51 0 0 0 3.5-3.51v-19.77H390v19.77a3.51 3.51 0 0 0 3.52 3.51Z"
          style={{
            fill: "#92e3a9",
            transformOrigin: "394.36px 377.25px 0",
          }}
          className="animable"
        />
      </g>
      <path
        d="M390 349.69h8.71v35.69a3.51 3.51 0 0 1-3.51 3.51h-1.69a3.51 3.51 0 0 1-3.51-3.51v-35.69h0Z"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "394.355px 369.29px 0",
        }}
        className="animable"
      />
      <path
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "394.37px 349.865px 0",
        }}
        className="animable"
        d="M388.38 348.23h11.98v3.27h-11.98z"
      />
      <path
        d="M376 349.69h8.71v35.69a3.51 3.51 0 0 1-3.51 3.51h-1.69a3.51 3.51 0 0 1-3.51-3.51v-35.69Z"
        style={{
          fill: "#fff",
          transformOrigin: "380.355px 369.29px 0",
        }}
        className="animable"
      />
      <g
        style={{
          clipPath: "url(#h)",
          transformOrigin: "380.36px 377.25px 0",
        }}
        className="animable"
      >
        <path
          d="M384.72 385.38v-19.77H376v19.77a3.51 3.51 0 0 0 3.51 3.51h1.69a3.51 3.51 0 0 0 3.52-3.51Z"
          style={{
            fill: "#92e3a9",
            transformOrigin: "380.36px 377.25px 0",
          }}
          className="animable"
        />
      </g>
      <path
        d="M376 349.69h8.71v35.69a3.51 3.51 0 0 1-3.51 3.51h-1.69a3.51 3.51 0 0 1-3.51-3.51v-35.69h0Z"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "380.355px 369.29px 0",
        }}
        className="animable"
      />
      <path
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "380.37px 349.865px 0",
        }}
        className="animable"
        d="M374.38 348.23h11.98v3.27h-11.98z"
      />
      <path
        d="M362 349.69h8.71v35.69a3.51 3.51 0 0 1-3.51 3.51h-1.69a3.51 3.51 0 0 1-3.51-3.51v-35.69Z"
        style={{
          fill: "#fff",
          transformOrigin: "366.355px 369.29px 0",
        }}
        className="animable"
      />
      <g
        style={{
          clipPath: "url(#i)",
          transformOrigin: "366.355px 377.25px 0",
        }}
        className="animable"
      >
        <path
          d="M362 365.61v19.77a3.51 3.51 0 0 0 3.51 3.51h1.69a3.51 3.51 0 0 0 3.51-3.51v-19.77Z"
          style={{
            fill: "#92e3a9",
            transformOrigin: "366.355px 377.25px 0",
          }}
          className="animable"
        />
      </g>
      <path
        d="M362 349.69h8.71v35.69a3.51 3.51 0 0 1-3.51 3.51h-1.69a3.51 3.51 0 0 1-3.51-3.51v-35.69h0Z"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "366.355px 369.29px 0",
        }}
        className="animable"
      />
      <path
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "366.36px 349.865px 0",
        }}
        className="animable"
        d="M360.37 348.23h11.98v3.27h-11.98z"
      />
      <path
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "385.76px 358.575px 0",
        }}
        className="animable"
        d="M355.27 357.22h60.98v2.71h-60.98z"
      />
      <path
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "385.76px 392.905px 0",
        }}
        className="animable"
        d="M355.27 389.29h60.98v7.23h-60.98z"
      />
      <path
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "354.815px 370.77px 0",
        }}
        className="animable"
        d="M353.01 344.12h3.61v53.3h-3.61z"
      />
      <path
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "414.895px 370.77px 0",
        }}
        className="animable"
        d="M413.09 344.12h3.61v53.3h-3.61z"
      />
      <path
        d="M206 387.16 191.31 361v-18a2.48 2.48 0 0 0-.91-4.79h-15.35a2.48 2.48 0 0 0-.91 4.79v17.34h0l-14.73 26.9a6.73 6.73 0 0 0 6 9.79h34.69a6.73 6.73 0 0 0 5.9-9.87Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "182.726px 367.62px 0",
        }}
        className="animable"
      />
      <path
        d="M195.36 374h-25.44l-6.61 12a5.59 5.59 0 0 0 5 8.14h28.87a5.59 5.59 0 0 0 4.93-8.23Z"
        style={{
          fill: "#92e3a9",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "182.734px 384.07px 0",
        }}
        className="animable"
      />
      <path
        d="M77.37 382.59a2 2 0 0 1-2-2v-148a2 2 0 0 1 4 0v148a2 2 0 0 1-2 2Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "77.37px 306.59px 0",
        }}
        className="animable"
      />
      <path
        d="M142 242.48H73.4a2 2 0 0 1 0-4H142a2 2 0 0 1 0 4Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "107.7px 240.48px 0",
        }}
        className="animable"
      />
      <rect
        x={67.16}
        y={380.02}
        width={70.85}
        height={15.3}
        rx={2.75}
        style={{
          fill: "#263238",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "102.585px 387.67px 0",
        }}
        className="animable"
      />
      <path
        style={{
          fill: "#263238",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "77.27px 240.28px 0",
        }}
        className="animable"
        d="M74.74 237.61h5.06v5.34h-5.06z"
      />
      <path
        d="M153.16 250.47v-21h-11v21a20.24 20.24 0 1 0 11 0Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "147.66px 259.829px 0",
        }}
        className="animable"
      />
      <path
        d="M153.73 231.15h-12.09a1.41 1.41 0 0 1-1.4-1.41h0a1.4 1.4 0 0 1 1.4-1.4h12.09a1.4 1.4 0 0 1 1.4 1.4h0a1.41 1.41 0 0 1-1.4 1.41Z"
        style={{
          fill: "#fff",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "147.685px 229.745px 0",
        }}
        className="animable"
      />
      <path
        d="M132.38 261.22a17.43 17.43 0 1 0 30.3 0Z"
        style={{
          fill: "#92e3a9",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "147.53px 274.244px 0",
        }}
        className="animable"
      />
      <circle
        cx={146.25}
        cy={269.75}
        r={2.75}
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "146.25px 269.75px 0",
        }}
        className="animable"
      />
      <circle
        cx={153.25}
        cy={268.25}
        r={1.25}
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "153.25px 268.25px 0",
        }}
        className="animable"
      />
      <path
        d="M142.67 275.59a1.59 1.59 0 1 1-1.58-1.59 1.58 1.58 0 0 1 1.58 1.59Z"
        style={{
          fill: "none",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "141.08px 275.59px 0",
        }}
        className="animable"
      />
      <path
        style={{
          fill: "#263238",
          stroke: "#263238",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transformOrigin: "147.67px 240.7px 0",
        }}
        className="animable"
        d="M139.1 235.64h17.14v10.12H139.1z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path
          d="M241.19 292.45s-3.66-7-4.32-11.31-3.66-17-6.33-23-15.64-13.64-18-13.31-7.32 13-7 18.31 6.33 12.31 8 14.64 5.66 15 8.32 19 3 5.66 3 5.66Z"
          style={{
            fill: "#92e3a9",
            stroke: "#263238",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </clipPath>
      <clipPath id="b">
        <path
          d="m240.53 288.13-19.64 11.64s7.32 13.32 11.32 24.63 12 32.62 25.29 32.28 25.63-17.3 25.63-17.3l-15.31-44.6-13.65 18.64Z"
          style={{
            fill: "#fff",
            stroke: "#263238",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </clipPath>
      <clipPath id="c">
        <path
          d="M303.71 254.8s15.55 2.78 24.54 7.1 21.44 12.58 26.76 29.22 2.66 95.29 2.66 95.29h-82.53s4-34.39.33-50-7.68-15.75-9.86-27.2c-6.5-34.03 11.81-58.07 38.1-54.41Z"
          style={{
            fill: "#fff",
            stroke: "#263238",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </clipPath>
      <clipPath id="d">
        <path
          d="m259.5 332.72-10.65-10.31s-.67-4-2-5a42.67 42.67 0 0 1-3.33-3s-8-16-11.31-20.64a12.9 12.9 0 0 0-11.32-5.65c-3 .33-16 1.33-17.3 4.32-.41.92 1.33 3.66 1.33 3.66s-3.33 1.67-2.66 4.66 2 3.33 2 3.33-4 3-2.66 5.33a5.21 5.21 0 0 0 3.33 2.66s-2.66 3 .33 4a61.81 61.81 0 0 0 6.32 1.67s3.66 9.31 7 9.65a60.54 60.54 0 0 1 7.32 1.33s6.66 13.64 12 20 15 7 15 7Z"
          style={{
            fill: "#92e3a9",
            stroke: "#263238",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </clipPath>
      <clipPath id="e">
        <path
          d="M321.73 275.48s-5.32 11.65-6.32 21-13.64 45.09-13.64 45.09-25.63-7.15-32.95-9.15a64.88 64.88 0 0 1-14.22-6.15l-14.89 26.89s41.43 24.21 60.06 27.2 21.68 3.64 30.67-4.36 22.91-61.25 22.91-61.25"
          style={{
            fill: "#fff",
            stroke: "#263238",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </clipPath>
      <clipPath id="f">
        <path
          d="M247.71 223.25s-1.77 14.18 1.06 26.94 8.16 29.07 12.06 29.42 24.1-13.11 25.52-19.85 1.41-9.57 1.41-18.08a166 166 0 0 0-1.06-20.91c-.71-5.32-3.9-11-13.47-9.57s-21.98 5.32-25.52 12.05Z"
          style={{
            fill: "#fff",
            stroke: "#263238",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </clipPath>
      <clipPath id="g">
        <path
          d="M390 349.69h8.71v35.69a3.51 3.51 0 0 1-3.51 3.51h-1.69a3.51 3.51 0 0 1-3.51-3.51v-35.69h0Z"
          style={{
            fill: "#fff",
            stroke: "#263238",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </clipPath>
      <clipPath id="h">
        <path
          d="M376 349.69h8.71v35.69a3.51 3.51 0 0 1-3.51 3.51h-1.69a3.51 3.51 0 0 1-3.51-3.51v-35.69h0Z"
          style={{
            fill: "#fff",
            stroke: "#263238",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </clipPath>
      <clipPath id="i">
        <path
          d="M362 349.69h8.71v35.69a3.51 3.51 0 0 1-3.51 3.51h-1.69a3.51 3.51 0 0 1-3.51-3.51v-35.69h0Z"
          style={{
            fill: "#fff",
            stroke: "#263238",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </clipPath>
    </defs>
    </svg>
  );
};

export default CoursesBackground;
