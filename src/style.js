import createEmotion from "create-emotion";

export const theme = {
  fontFamily: "'Open Sans', Helvetica, Arial, sans-serif",
  fontSize: "16px",
  textColor: "#1b1b1b",
  black: "#000",
  white: "#fff",
  brandOrange: "#ff8300",
  brandBlue: "#004876",
  brandBrightBlue: "#297bc0",
  borderColor: "#eaeaea",
  buttonActiveColor: "#f0f0f0",
  buttonHoverColor: "#f8f8f8",
  buttonSeparatorColor: "#f0f0f0",
  borderRadius: 6
};

export const mixins = {
  buttonReset: {
    padding: 0,
    margin: 0,
    font: "inherit",
    border: 0,
    borderRadius: 0,
    background: "transparent",
    color: "inherit"
  },
  borderBox: {
    boxSizing: "border-box"
  },
  focusOutline: {
    "&:focus": {
      outline: 0,
      boxShadow: "0 0 0 2px white, 0 0 0 4px black"
    }
  },
  focusDarken: {
    "&:focus": {
      outline: 0,
      boxShadow: "inset 0 0 0 9999px rgba(0, 0, 0, 0.1)"
    }
  },
  focusNone: {
    "&:focus": {
      outline: "none"
    }
  },
  shadow: {
    boxShadow: "0 0 3px rgba(0, 0, 0, 0.25)"
  },
  rounded: {
    borderRadius: theme.borderRadius
  },
  paddingMedium: {
    padding: "20px"
  },
  pointer: {
    cursor: "pointer",
    "&:disabled": {
      cursor: "default"
    }
  }
};

// This doesn't seem strictly necessary based on the docs but idk
const context = typeof global !== "undefined" ? global : {};

// Feel free to uncomment these as we need more functions from Emotion,
// especially `keyframes` if we need to start doing animations.
export const {
  // flush,
  // hydrate,
  cx,
  // merge,
  // getRegisteredStyles,
  // injectGlobal,
  // keyframes,
  css
  // sheet,
  // caches
} = createEmotion(context, {
  key: "meridian-sdk"
});
