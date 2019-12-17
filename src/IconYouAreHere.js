import { h } from "preact";
import { css } from "./style";

const IconDirections = () => (
  <div className={css({ width: 32, height: 32 })}>
    <svg width="72" height="77" fill="none">
      <path
        d="M35.55 76.1a2.55 2.55 0 100-5.1 2.55 2.55 0 000 5.1z"
        fill="#F2AF1D"
      />
      <g filter="url(#filter0_d)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M31.818 61.526C19.452 59.558 10 48.846 10 35.925 10 21.607 21.607 10 35.925 10 50.243 10 61.85 21.607 61.85 35.925c0 12.92-9.45 23.632-21.816 25.601a.52.52 0 01-.301.079c-1.7 0-4.187 4.495-4.187 4.495s-1.989-3.891-3.728-4.573z"
          fill="#F2AF1D"
        />
      </g>
      <path
        d="M36.5 23l3.03 9.328h9.81l-7.936 5.765 3.031 9.329-7.935-5.765-7.935 5.765 3.03-9.328-7.934-5.766h9.808L36.5 23z"
        fill="#fff"
      />
      <defs>
        <filter
          id="filter0_d"
          x="0"
          y="0"
          width="71.85"
          height="76.1"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="5" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  </div>
);

export default IconDirections;
