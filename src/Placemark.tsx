/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { css, cx, mixins, theme } from "./style";
import { getPlacemarkCategories } from "./util";
import {
  CreateMapPlacemarksOptions,
  PlacemarkData,
  placemarkIconURL,
} from "./web-sdk";

const SIZE = 24;

interface PlacemarkProps {
  isSelected: boolean;
  data: PlacemarkData;
  mapZoomFactor: number;
  onClick?: (placemark: PlacemarkData) => void;
  disabled?: boolean;
  labelMode: CreateMapPlacemarksOptions["labelMode"];
  labelZoomLevel: CreateMapPlacemarksOptions["labelZoomLevel"];
  rotate?: boolean;
}

const Placemark: FunctionComponent<PlacemarkProps> = ({
  isSelected,
  data,
  mapZoomFactor,
  onClick = () => {},
  disabled = false,
  labelMode,
  labelZoomLevel = 0.2,
  rotate,
}) => {
  const cssTypeName = `meridian-placemark-type-${data.type}`;
  const labelOnly = !data.type || data.type.indexOf("label_") === 0;
  const k = 1 / mapZoomFactor;
  const color = `#${data.color}`;
  const iconURL = placemarkIconURL(data.type);
  const placemark_id = (data.id || "").split("_").pop();
  const iconClassName = isSelected
    ? cx(
        "meridian-placemark-icon-selected",
        "meridian-placemark-icon",
        cssTypeName,
        cssPlacemarkIconSelected
      )
    : cx("meridian-placemark-icon", cssTypeName, cssPlacemarkIcon);
  const style = {
    left: data.x,
    top: data.y,
    transform: rotate
      ? `translate(-50%, -50%) rotate(-90deg) scale(${k})`
      : `translate(-50%, -50%) scale(${k})`,
  } as const;

  if (labelOnly) {
    // labelMode is static (zoom) for Label Placemarks
    return (
      <div
        className={cx("meridian-placemark", cssPlacemark)}
        data-meridian-placemark-label-mode="zoom"
        style={style}
      >
        <div
          className={cx(
            cssLabel,
            cssLabelOnly,
            "meridian-label",
            "meridian-label-only"
          )}
          data-meridian-placemark-id={placemark_id}
          data-meridian-placemark-label-zoom-visible={String(
            mapZoomFactor >= labelZoomLevel
          )}
        >
          {data.name}
        </div>
      </div>
    );
  }
  return (
    <div
      data-meridian-placemark-label-mode={labelMode}
      className={cx("meridian-placemark", cssPlacemark)}
      style={style}
    >
      <button
        disabled={disabled}
        className={cx(
          getPlacemarkCategories(data).map((category: string) => {
            category = category
              .replace(/ /g, "-")
              .replace(/[^a-z0-9_-]/i, "")
              .toLowerCase();
            return `meridian-placemark-category-${category}`;
          }),
          iconClassName
        )}
        data-meridian-placemark-id={placemark_id}
        style={{
          "--meridian-placemark-iconURL": `url('${iconURL}')`,
          "--meridian-placemark-borderColor": color,
          "--meridian-placemark-backgroundColor": color,
        }}
        onClick={(event) => {
          if (event.target instanceof HTMLElement) {
            event.target.focus();
          }
          onClick(data);
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      />
      <div
        className={cx("meridian-label", cssLabel)}
        data-meridian-placemark-label-zoom-visible={String(
          mapZoomFactor >= labelZoomLevel
        )}
      >
        {data.name}
      </div>
    </div>
  );
};

const cssLabel = css(mixins.textStrokeWhite, {
  label: "placemark-label",
  marginLeft: "50%",
  position: "absolute",
  minWidth: 55,
  maxWidth: 120,
  fontSize: 14,
  textAlign: "center",
  paddingTop: 4,
  color: "#222",
  userSelect: "none",
  transform: "translate(-50%, 0)",
  fontWeight: "bold",
  visibility: "hidden",
  pointerEvents: "none",

  "[data-meridian-placemark-label-mode='always'] > &": {
    visibility: "visible",
  },

  "[data-meridian-placemark-label-mode='never'] > &": {
    visibility: "hidden",
  },

  "[data-meridian-placemark-label-mode='hover']:hover > &": {
    visibility: "visible",
    background: "#333",
    color: "#eee",
    textShadow: "none",
    borderRadius: 4,
    padding: 4,
    bottom: 30,
    maxWidth: 240,
    width: "max-content",
    boxShadow: "0 0 1px 1px white",
  },

  "[data-meridian-placemark-label-mode='zoom'] > &[data-meridian-placemark-label-zoom-visible='false']":
    {
      visibility: "hidden",
    },

  "[data-meridian-placemark-label-mode='zoom'] > &[data-meridian-placemark-label-zoom-visible='true']":
    {
      visibility: "visible",
    },
});

const cssLabelOnly = css({
  label: "placemark-labelOnly",
  textTransform: "uppercase",
  color: "#666",
  fontSize: 16,
});

const cssPlacemark = css({
  label: "placemark",
  position: "absolute",

  "&[data-meridian-placemark-label-mode='hover']:hover": {
    zIndex: 1,
  },
});

const cssPlacemarkIcon = css(
  mixins.buttonReset,
  mixins.pointer,
  mixins.focusNone,
  {
    label: "placemark-icon",
    "--meridian-placemark-backgroundColor": theme.brandBlue,
    transition: "width 80ms ease, height 80ms ease",
    display: "block",
    width: SIZE,
    height: SIZE,
    borderRadius: "100%",
    backgroundColor: "var(--meridian-placemark-backgroundColor)",
    backgroundImage: "var(--meridian-placemark-iconURL)",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    border: "2px solid transparent",
    overflow: "hidden",
    zIndex: 1,
  }
);

const cssPlacemarkIconSelected = css(cssPlacemarkIcon, {
  zIndex: 3,
  width: SIZE * 1.25,
  height: SIZE * 1.25,
  boxShadow: "0 0 4px black",
});

export default Placemark;
