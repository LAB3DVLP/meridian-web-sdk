/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { css } from "./style";

const Watermark: FunctionComponent = () => (
  <div className={cssWatermark}>
    <svg className={cssLogo} viewBox="0 0 196.07 71.15">
      <path d="M93.4 55.8c-8.7-.2-15.5-7.5-15.3-16.1v-5.1c-.2.3-.4.5-.7.6-.2.1-.4.1-.6.1-.3 0-.7-.1-1-.4-1.2-1-2.7-1.6-4.3-1.6h-.1c-3.5 0-6.4 2.9-6.5 6.4V54c0 .8-.7 1.5-1.5 1.5h-6.8c-.6 0-1.2-.4-1.4-1-.1.2-.2.4-.4.6-.3.2-.6.4-1 .4h-.2c-.4-.1-3.8-.5-5.9-2.5-2.6 1.6-5.7 2.5-8.7 2.5h-.2c-8.8 0-16-7.1-16.1-15.9.1-8.8 7.4-16 16.1-16h.4c8 0 14.8 6 15.9 13.7V28c0-.4.2-.8.5-1.1.3-.3.6-.4 1-.4h.1c1.5.1 2.9.5 4.3 1.1 3-2.4 6.7-3.8 10.5-3.8 2 0 4 .4 5.9 1.1.6.2 1 .8 1 1.4v.4c.1-.2.2-.3.4-.5.3-.2.6-.3.9-.3h.4c2.7.7 7.9 3.7 8 10.3v4.1c.2 3.1 2.8 5.5 5.9 5.5h.4c3.2-.2 5.7-3 5.5-6.3v-7.1-.2c.4-6.5 5.6-8.8 7.3-9.6l.3-.1c.2-.1.4-.1.6-.1h.1c.7 0 1.3.5 1.5 1.1v-6.8c0-.8.7-1.5 1.5-1.5h.2c.2 0 .4 0 .6.1l.2.1c1.7.8 6.7 3.1 7.1 9.6 2.1-.9 4.3-1.4 6.7-1.4h.2c7.3 0 13.5 4.9 15.5 11.6 2-6.7 8.2-11.6 15.5-11.6h.4c8.8 0 16 7.1 16.1 15.9v14.4c0 .4-.2.8-.5 1.1-.3.2-.6.4-1 .4h-.2c-.4-.1-3.8-.5-5.9-2.5-2.6 1.6-5.7 2.5-8.7 2.5h-.2c-7.3 0-13.5-4.9-15.5-11.6-2 6.7-8.2 11.6-15.5 11.6h-.2c-3 0-5.9-.8-8.5-2.3-2.2 1.9-5.7 2.4-6.2 2.4h-.2c-.4 0-.7-.1-1-.4-.3-.3-.5-.7-.5-1.1V41.4c-.7 8.1-7.4 14.4-15.6 14.4h-.6zM39.1 33.2c-3.5 0-6.4 2.8-6.5 6.3-.1 3.6 2.7 6.6 6.3 6.7h.1c3.6 0 6.5-2.9 6.5-6.5 0-3.5-2.8-6.4-6.3-6.5h-.1zm86.9 0c-3.5 0-6.4 2.8-6.5 6.3-.1 3.6 2.7 6.6 6.3 6.7h.1c3.6 0 6.5-2.9 6.5-6.5 0-3.5-2.8-6.4-6.3-6.5h-.1zm31.4 0c-3.5 0-6.4 2.8-6.5 6.3-.1 3.6 2.7 6.6 6.3 6.7h.1c3.6-.1 6.5-3 6.6-6.5 0-3.5-2.8-6.4-6.3-6.5h-.2z" />
      <path
        d="M111.1 16.9c1.3.6 6.2 2.6 6.5 8.6v2.2c2.4-1.6 5.3-2.4 8.1-2.4h.2c8 0 14.5 6.4 14.6 14.4-.1 8-6.6 14.4-14.6 14.4h-.2c-3.1 0-6.2-1-8.7-2.8-1.7 2.4-6.1 2.9-6.1 2.9V16.9h.2m14.8 30.8c4.4 0 8.1-3.6 8.1-8 0-4.3-3.5-7.9-7.8-8h-.2c-4.3 0-7.9 3.4-8 7.8-.1 4.4 3.4 8.1 7.8 8.2h.1M108 24v16.4c-.2 7.7-6.5 13.8-14.2 13.8h-.4c-7.8-.2-14-6.7-13.8-14.6V27.4s6.8 1.7 6.8 8.9v4.2c.2 3.9 3.5 6.9 7.4 6.9h.5c4.1-.3 7.2-3.8 6.9-7.8v-7c.3-6 5.4-7.9 6.7-8.6h.1m49 1.3h.4c8 0 14.5 6.4 14.6 14.4v14.4s-4.3-.5-5.8-3c-2.6 1.9-5.8 3-9 3h-.2c-8 0-14.5-6.4-14.6-14.4.1-8 6.6-14.4 14.6-14.4m.3 22.4c4.4 0 8.1-3.6 8.1-8 0-4.3-3.5-7.9-7.8-8h-.2c-4.3 0-7.9 3.4-8 7.8-.1 4.4 3.4 8.1 7.8 8.2h.1M38.7 25.3h.4c8 0 14.5 6.4 14.6 14.4v14.4s-4.3-.5-5.8-3c-2.6 1.9-5.8 3-9 3h-.2c-8 0-14.5-6.4-14.6-14.4.1-8 6.6-14.4 14.6-14.4m.3 22.4c4.4 0 8.1-3.6 8.1-8 0-4.3-3.5-7.9-7.8-8h-.2c-4.3 0-7.9 3.4-8 7.8-.1 4.4 3.4 8.1 7.8 8.2h.1m32.4-22.4s.1 0 0 0c1.9 0 3.6.4 5.3 1v7.6c-1.5-1.3-3.4-1.9-5.3-1.9h-.1c-4.4 0-7.9 3.5-8 7.9v14.3h-6.8V28c1.6.1 3.2.6 4.6 1.4 2.8-2.7 6.5-4.1 10.3-4.1m39.7-11.4h-.1c-1.7 0-3 1.3-3 3V21h-.1c-.5 0-.9.1-1.3.3l-.3.1c-5.1 2.4-7.9 6-8.1 10.9v7.4c.2 2.4-1.7 4.5-4.1 4.7h-.3c-2.3 0-4.2-1.8-4.4-4.1v-.6-3.5c-.1-7.6-6-11-9.1-11.8-.2-.1-.5-.1-.7-.1h-.5c-.3-.4-.8-.8-1.3-.9-2-.8-4.2-1.2-6.4-1.2h-.1c-3.9 0-7.7 1.2-10.8 3.5-1.3-.5-2.6-.8-4-.8h-.2c-.8 0-1.5.3-2.1.8-.6.6-.9 1.4-.9 2.2v1.9c-3.2-4.6-8.5-7.6-14.4-7.6h-.4c-9.6 0-17.5 7.8-17.6 17.4v.1c.1 9.6 8 17.4 17.6 17.4h.2c3 0 5.9-.8 8.6-2.2 2.4 1.7 5.4 2.1 5.9 2.2h.4c.5 0 1-.1 1.4-.4.4.2.9.4 1.4.4h6.8c1.7 0 3-1.3 3-3V39.8c0-2.7 2.3-4.9 5-4.9h.2c1.2 0 2.4.4 3.4 1.2.5.4 1.1.7 1.8.7v2.8c-.1 4.6 1.6 8.9 4.7 12.3 3.2 3.3 7.4 5.2 12 5.4h.5c5.9 0 11.1-2.9 14.1-7.4v4.3c0 .9.4 1.7 1 2.2.6.5 1.3.8 2 .8h.3c.7-.1 3.7-.5 6.2-2.1 2.6 1.3 5.4 2 8.3 2h.2c6.6 0 12.5-3.7 15.5-9.2 3 5.5 8.8 9.2 15.5 9.2h.3c3 0 5.9-.8 8.6-2.2 2.4 1.7 5.4 2.1 5.9 2.2h.4c.7 0 1.4-.3 2-.8.6-.6 1-1.4 1-2.2V39.7c-.1-9.6-8-17.4-17.6-17.4h-.4c-6.6 0-12.5 3.7-15.5 9.2-3-5.5-8.8-9.2-15.5-9.2h-.2c-1.8 0-3.7.3-5.4.8-.8-3.9-3.4-6.9-7.7-8.9l-.2-.1c-.6-.1-1-.2-1.5-.2zm46.3 30.8h-.2c-2.8-.1-4.9-2.4-4.9-5.1.1-2.7 2.3-4.9 5-4.9h.1c2.7.1 4.9 2.3 4.9 5 .1 2.7-2.2 4.9-4.9 5zm-31.3 0h-.2c-2.8-.1-4.9-2.4-4.9-5.1.1-2.7 2.3-4.9 5-4.9h.1c2.7.1 4.9 2.3 4.9 5s-2.2 4.9-4.9 5zm-87 0h-.2c-1.3 0-2.6-.6-3.5-1.6-.9-1-1.4-2.2-1.4-3.6.1-2.7 2.3-4.9 5-4.9h.1c2.7.1 4.9 2.3 4.9 5 .1 2.8-2.1 5-4.9 5.1z"
        fill="#fff"
      />
    </svg>
  </div>
);

const cssWatermark = css({
  label: "watermark",
  overflow: "hidden",
  position: "absolute",
  transform: "translate(-50%, 0)",
  opacity: 0.4,
  zIndex: 1,
  left: "50%",
  top: 0,
});

const cssLogo = css({
  label: "watermark-logo",
  display: "block",
  fill: "black",
  width: 70,
  height: 30,
});

export default Watermark;
