/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { event as d3Event, select as d3Select } from "d3-selection";
import {
  zoom as d3Zoom,
  zoomIdentity as d3ZoomIdentity,
  zoomTransform as d3ZoomTransform
} from "d3-zoom";
import { Component, Fragment, h } from "preact";
import PropTypes from "prop-types";
import AnnotationLayer from "./AnnotationLayer";
import ErrorOverlay from "./ErrorOverlay";
import FloorAndTagControls from "./FloorAndTagControls";
import FloorLabel from "./FloorLabel";
import FloorOverlay from "./FloorOverlay";
import LoadingSpinner from "./LoadingSpinner";
import MapMarkerOverlay from "./MapMarkerOverlay";
import OverlayLayer from "./OverlayLayer";
import PlacemarkLayer from "./PlacemarkLayer";
import { css, cx } from "./style";
import TagLayer from "./TagLayer";
import TagListOverlay from "./TagListOverlay";
import { asyncClientCall, isEnvOptions } from "./util";
import Watermark from "./Watermark";
import ZoomControls from "./ZoomControls";

const ZOOM_FACTOR = 0.5;
const ZOOM_DURATION = 250;

const cssMapContainer = css({
  label: "map-container",
  display: "block",
  position: "relative",
  borderRadius: "inherit",
  background: "#fafafa",
  color: "#000",
  fontFamily: "inherit",
  textAlign: "left"
});

const cssMap = css({
  label: "map-outer",
  borderRadius: "inherit",
  display: "block",
  overflow: "hidden"
});

export default class Map extends Component {
  static propTypes = {
    destroy: PropTypes.func.isRequired,
    shouldMapPanZoom: PropTypes.func,
    update: PropTypes.func.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    locationID: PropTypes.string.isRequired,
    floorID: PropTypes.string.isRequired,
    api: PropTypes.object,
    showFloorsControl: PropTypes.bool,
    showTagsControl: PropTypes.bool,
    loadTags: PropTypes.bool,
    tags: PropTypes.shape({
      showControlTags: PropTypes.bool,
      filter: PropTypes.func,
      disabled: PropTypes.bool
    }),
    loadPlacemarks: PropTypes.bool,
    placemarks: PropTypes.shape({
      showHiddenPlacemarks: PropTypes.bool,
      filter: PropTypes.func,
      disabled: PropTypes.bool
    }),
    overlays: PropTypes.array,
    onMarkerClick: PropTypes.func,
    onTagClick: PropTypes.func,
    onPlacemarkClick: PropTypes.func,
    onMapClick: PropTypes.func,
    onTagsUpdate: PropTypes.func,
    onPlacemarksUpdate: PropTypes.func,
    onFloorsUpdate: PropTypes.func
  };

  static defaultProps = {
    loadTags: true,
    loadPlacemarks: true,
    showTagsControl: true,
    showFloorsControl: true,
    shouldMapPanZoom: () => true,
    width: "100%",
    height: "400px",
    placemarks: {},
    tags: {},
    overlays: [],
    annotations: [],
    onTagsUpdate: () => {},
    onFloorChange: () => {},
    onFloorsUpdate: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      mapImageURL: null,
      isFloorOverlayOpen: false,
      isTagListOverlayOpen: false,
      isMapMarkerOverlayOpen: false,
      isErrorOverlayOpen: false,
      isPanningOrZooming: false,
      loadingSources: {},
      errors: [],
      mapTransform: "",
      mapZoomFactor: 0.5,
      floors: [],
      placemarks: {},
      svgURL: null,
      tagsConnection: null,
      tagsStatus: "Connecting",
      selectedItem: null,
      areTagsLoading: props.loadTags,
      allTagData: []
    };
    this.isMounted = false;
    this.tagsTimeout = null;
    this.mapSelection = null;
    this.mapRef = null;
    this.mapContainerRef = null;
    this.validateFloorID();
  }

  componentDidMount() {
    this.isMounted = true;
    const { api, locationID } = this.props;
    if (!isEnvOptions(api.environment)) {
      this.toggleErrorOverlay({
        open: true,
        message: `API error: "${api.environment}" is not a valid environment`
      });
    } else if (!locationID) {
      this.toggleErrorOverlay({
        open: true,
        message: `createMap error: "options.locationID" is required`
      });
    } else {
      this.loadData();
    }
    // It would be really nice if the custom element `disonnectedCallback()` had
    // some kind of regular DOM equivalent.
    //
    // Basically, with `MutationObserver` you can either watch for direct
    // children or ALL descendants of a node. But there's no way to *just* know
    // if a node in question has become disconnected from the DOM. So you'd
    // either have to listen to `document.body` and have a callback called on
    // every single DOM modification in the entire app.
    //
    // Or we can simply poll periodically to see if we're connected to the DOM.
    // I haven't done benchmarking, but my gut instinct says the polling method
    // is probably less resource intensive, and is certainly easier to write.
    this.intervalAutoDestroy = setInterval(() => {
      if (
        this.isMounted &&
        this.mapContainerRef &&
        !this.mapContainerRef.isConnected
      ) {
        this.props.destroy();
      }
    }, 1000);
  }

  async loadData() {
    await this.initializeFloors();
    this.updatePlacemarks();
    this.initializeTags();
    this.fetchMapImageURL();
  }

  componentDidUpdate(prevProps) {
    if (this.props.locationID !== prevProps.locationID) {
      this.toggleTagListOverlay({ open: false });
      this.toggleErrorOverlay({ open: false });
      this.toggleMapMarkerOverlay({ open: false });
      this.toggleFloorOverlay({ open: false });
      this.zoomToDefault();
      this.freeMapImageURL();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ mapImageURL: null, placemarks: {} });
      this.loadData();
      return;
    } else if (this.props.loadTags && !prevProps.loadTags) {
      this.initializeTags();
    }
    if (prevProps.floorID !== this.props.floorID) {
      this.zoomToDefault();
      this.validateFloorID();
    }
    if (prevProps.floorID !== this.props.floorID) {
      this.freeMapImageURL();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ mapImageURL: null, placemarks: {} });
      this.fetchMapImageURL();
      this.updatePlacemarks();
    } else if (this.props.loadPlacemarks !== prevProps.loadPlacemarks) {
      this.updatePlacemarks();
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
    if (this.tagsTimeout) {
      clearTimeout(this.tagsTimeout);
    }
    this.freeMapImageURL();
    clearInterval(this.intervalAutoDestroy);
  }

  freeMapImageURL() {
    if (this.state.mapImageURL) {
      URL.revokeObjectURL(this.state.mapImageURL);
    }
  }

  async fetchMapImageURL() {
    const { api, locationID, floorID } = this.props;
    const mapData = this.getMapData();
    if (!mapData) {
      return;
    }
    const url = await api.fetchSVG(mapData.svg_url);
    if (!this.isMounted) {
      return;
    }
    if (
      floorID === this.props.floorID &&
      locationID === this.props.locationID
    ) {
      this.setState({ mapImageURL: url });
    } else {
      URL.revokeObjectURL(url);
    }
  }

  updateMap = newOptions => {
    const { update } = this.props;
    update(newOptions);
  };

  // Helpful message for SDK devs
  validateFloorID() {
    const { floorID } = this.props;
    if (!floorID) {
      this.toggleErrorOverlay({
        open: true,
        message: `createMap error: "options.floorID" is required`
      });
    }
  }

  initializeTags() {
    const loop = async () => {
      try {
        // Clear any existing timers so we don't have two running at once
        if (this.tagsTimeout) {
          clearTimeout(this.tagsTimeout);
        }
        const { api, locationID } = this.props;
        this.setState({ areTagsLoading: true });
        const allTagData = await api.fetchTagsByLocation(locationID);
        if (!this.isMounted) {
          return;
        }
        if (locationID !== this.props.locationID || !this.props.loadTags) {
          return;
        }
        this.setState({ allTagData });
        this.tagsTimeout = setTimeout(loop, 5 * 60 * 1000);
      } finally {
        this.setState({ areTagsLoading: false });
      }
    };
    if (this.props.loadTags) {
      loop();
    }
    // We're not using setInterval for this because we want to wait on the async
    // function to complete to avoid race conditions
  }

  toggleTagListOverlay = ({ open }) => {
    if (!this.isMounted) {
      return;
    }
    this.setState({ isTagListOverlayOpen: open });
  };

  toggleFloorOverlay = ({ open }) => {
    if (!this.isMounted) {
      return;
    }
    this.setState({ isFloorOverlayOpen: open });
  };

  toggleErrorOverlay = ({ open, message = "Unknown" }) => {
    if (!this.isMounted) {
      return;
    }
    if (open) {
      this.setState(prevState => ({
        errors: [...prevState.errors, message],
        isErrorOverlayOpen: true
      }));
    } else {
      this.setState({ isErrorOverlayOpen: false, errors: [] });
    }
  };

  toggleLoadingSpinner = ({ show, source = "unknown" }) => {
    if (!this.isMounted) {
      return;
    }
    this.setState(prevState => ({
      loadingSources: {
        ...prevState.loadingSources,
        [source]: show
      }
    }));
  };

  showLoadingSpinner() {
    const { loadingSources } = this.state;
    return Object.keys(loadingSources).some(item => {
      return loadingSources[item] === true;
    });
  }

  toggleMapMarkerOverlay = ({ open, selectedItem = null }) => {
    this.setState({ isMapMarkerOverlayOpen: open, selectedItem });
  };

  selectFloorByID = floorID => {
    this.updateMap({ floorID, annotations: [], overlays: [] });
    asyncClientCall(
      this.props.onFloorChange,
      this.state.floors.find(f => f.id === floorID)
    );
  };

  groupPlacemarksByID = placemarks => {
    return placemarks
      .map(placemark => this.normalizePlacemark(placemark))
      .reduce((obj, placemark) => {
        obj[placemark.id] = placemark;
        return obj;
      }, {});
  };

  normalizePlacemark(placemark) {
    return { kind: "placemark", ...placemark };
  }

  async updatePlacemarks() {
    const { locationID, floorID, api } = this.props;
    let results = [];

    this.toggleLoadingSpinner({ show: true, source: "placemarks" });

    if (this.props.loadPlacemarks) {
      results = await api.fetchPlacemarksByFloor(locationID, floorID);
    }
    if (!this.isMounted) {
      return;
    }

    // If the user switches floors, we want to get rid of the value
    if (
      floorID === this.props.floorID &&
      locationID === this.props.locationID
    ) {
      const placemarks = this.groupPlacemarksByID(results);
      this.setState({ placemarks }, () => {
        this.toggleLoadingSpinner({ show: false, source: "placemarks" });
      });
    }
  }

  async getFloors() {
    const { locationID, api } = this.props;
    let results;
    try {
      results = await api.fetchFloorsByLocation(locationID);
      if (!this.isMounted) {
        return [];
      }
    } catch (err) {
      // TODO: compare with other error objects, similar?
      if (err.response && err.response.data && err.response.data.detail) {
        this.toggleErrorOverlay({
          open: true,
          message: err.response.data.detail
        });
      }
    }
    if (!results || !results.length) {
      this.toggleErrorOverlay({
        open: true,
        message: "Floor data could not be found."
      });
    }
    return results;
  }

  // TODO: We might want to memoize this based on floorID eventually
  getMapData() {
    const { floorID } = this.props;
    const { floors } = this.state;
    for (const floor of floors) {
      if (floor.id === floorID) {
        return floor;
      }
    }
    return null;
  }

  async initializeFloors() {
    this.toggleLoadingSpinner({ show: true, source: "map" });
    const { onFloorsUpdate, locationID } = this.props;
    const floors = await this.getFloors();
    if (!this.isMounted) {
      return;
    }
    if (locationID !== this.props.locationID) {
      return;
    }
    if (floors && floors.length > 0) {
      this.setState({ floors }, () => {
        if (!this.zoomD3) {
          this.addZoomBehavior();
        }
        this.zoomToDefault();
        asyncClientCall(onFloorsUpdate, floors);
      });
    }
    this.toggleLoadingSpinner({ show: false, source: "map" });
  }

  addZoomBehavior() {
    if (this.mapRef) {
      const onZoom = () => {
        const { k, x, y } = d3ZoomTransform(this.mapRef);
        const t = `translate(${x}px, ${y}px) scale(${k})`;
        this.setState({
          mapTransform: t,
          mapZoomFactor: k,
          isPanningOrZooming: true
        });
      };
      const onZoomEnd = () => {
        this.setState({ isPanningOrZooming: false });
      };
      this.zoomD3 = d3Zoom()
        // Don't destructure this at the top of the file because we need d3 to
        // hook until whatever the latest version of the function is, even if it
        // has changed since this callback was registered
        .filter(() => this.props.shouldMapPanZoom(d3Event))
        // min/max zoom levels
        .scaleExtent([1 / 16, 14])
        .duration(ZOOM_DURATION)
        .on("zoom", onZoom)
        .on("end.zoom", onZoomEnd);
      this.mapSelection = d3Select(this.mapRef);
      this.mapSelection.call(this.zoomD3);
    }
  }

  zoomToDefault() {
    const mapData = this.getMapData();
    const mapSize = this.getMapRefSize();
    if (mapData) {
      this.mapSelection.call(
        this.zoomD3.translateTo,
        mapData.width / 2,
        mapData.height / 2
      );
      this.mapSelection.call(
        this.zoomD3.scaleTo,
        // TODO: Figure out the appropriate scale level to show the "whole" map.
        // This is currently just a quick calculation that seems to work ok.
        (0.5 * mapSize.width) / mapData.width
      );
    }
  }

  getMapRefSize() {
    return {
      width: this.mapRef.clientWidth,
      height: this.mapRef.clientHeight
    };
  }

  zoomToPoint = (x, y, k) => {
    const { width, height } = this.getMapRefSize();
    // I'm so sorry, but it's really hard to center things, and also math
    const t = d3ZoomIdentity
      .translate(-k * x + width / 2, -k * y + height / 2)
      .scale(k);
    this.mapSelection
      .transition()
      .duration(ZOOM_DURATION)
      .call(this.zoomD3.transform, t);
  };

  zoomBy = factor => {
    this.mapSelection
      .transition()
      .duration(ZOOM_DURATION)
      .call(this.zoomD3.scaleBy, factor);
  };

  zoomIn = () => {
    this.zoomBy(1 + ZOOM_FACTOR);
  };

  zoomOut = () => {
    this.zoomBy(1 - ZOOM_FACTOR);
  };

  onClick = event => {
    const mapClicked =
      this.mapRef.isEqualNode(event.target) ||
      this.mapImage.isEqualNode(event.target);
    if (this.props.onMapClick && mapClicked) {
      // eslint-disable-next-line no-console
      console.warn("onMapClick() is experimental, please do not use it");
      setTimeout(() => {
        this.props.onMapClick(event);
      }, 0);
    } else if (mapClicked) {
      this.toggleMapMarkerOverlay({ open: false });
    }
  };

  onMarkerClick = async data => {
    let showOverlay = true;
    const { onTagClick, onPlacemarkClick, onMarkerClick } = this.props;
    const callback = data.event_type ? onTagClick : onPlacemarkClick;
    const clientCallback = async () => {
      if (callback) {
        try {
          await callback(data, { preventDefault });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }
      if (onMarkerClick) {
        // eslint-disable-next-line no-console
        console.warn("onMarkerClick() is experimental, please do not use it");
        try {
          await onMarkerClick(data, { preventDefault });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }
    };

    const preventDefault = () => {
      showOverlay = false;
    };

    await clientCallback();
    if (showOverlay) {
      this.toggleMapMarkerOverlay({ open: true, selectedItem: data });
    }
  };

  shouldShowFloors() {
    const { showFloorsControl } = this.props;
    const { floors } = this.state;
    return showFloorsControl && floors.length > 1;
  }

  renderFloorLabel() {
    const floor = this.getMapData();
    if (floor) {
      return (
        <FloorLabel buildingName={floor.group_name} floorName={floor.name} />
      );
    }
    return null;
  }

  renderFloorOverlay() {
    const { floorID } = this.props;
    const { isFloorOverlayOpen, floors } = this.state;
    if (isFloorOverlayOpen) {
      return (
        <FloorOverlay
          currentFloorID={floorID}
          floors={floors}
          toggleFloorOverlay={this.toggleFloorOverlay}
          selectFloorByID={this.selectFloorByID}
        />
      );
    }
    return null;
  }

  renderTagListOverlay() {
    const { locationID, floorID, api, tags, loadTags } = this.props;
    const {
      isTagListOverlayOpen,
      floors,
      allTagData,
      areTagsLoading
    } = this.state;
    if (isTagListOverlayOpen && loadTags) {
      return (
        <TagListOverlay
          onMarkerClick={this.onMarkerClick}
          showControlTags={Boolean(tags.showControlTags)}
          floors={floors}
          loading={areTagsLoading}
          tags={allTagData}
          tagOptions={tags}
          updateMap={this.updateMap}
          api={api}
          locationID={locationID}
          currentFloorID={floorID}
          toggleTagListOverlay={this.toggleTagListOverlay}
        />
      );
    }
    return null;
  }

  renderMapMarkerOverlay() {
    const { isMapMarkerOverlayOpen, selectedItem } = this.state;
    if (isMapMarkerOverlayOpen && selectedItem) {
      return (
        <MapMarkerOverlay
          toggleMapMarkerOverlay={this.toggleMapMarkerOverlay}
          kind={selectedItem.kind === "placemark" ? "placemark" : "tag"}
          item={selectedItem}
        />
      );
    }
    return null;
  }

  renderLoadingSpinner() {
    if (this.showLoadingSpinner()) {
      return <LoadingSpinner />;
    }
    return null;
  }

  renderErrorOverlay() {
    if (this.state.isErrorOverlayOpen) {
      return (
        <ErrorOverlay
          toggleErrorOverlay={this.toggleErrorOverlay}
          messages={this.state.errors}
        />
      );
    }
    return null;
  }

  render() {
    const mapData = this.getMapData();
    const {
      mapImageURL,
      selectedItem,
      mapTransform,
      mapZoomFactor,
      isPanningOrZooming,
      errors
    } = this.state;
    const {
      showTagsControl,
      locationID,
      floorID,
      api,
      tags,
      placemarks,
      overlays,
      annotations,
      width,
      height,
      onTagsUpdate,
      onPlacemarksUpdate,
      loadTags
    } = this.props;
    return (
      <div
        className={cx("meridian-map-container", cssMapContainer)}
        style={{ width, height }}
        data-testid="meridian--private--map-container"
        ref={ref => {
          this.mapContainerRef = ref;
        }}
      >
        <Watermark />
        <ZoomControls onZoomIn={this.zoomIn} onZoomOut={this.zoomOut} />
        {this.renderLoadingSpinner()}
        {this.renderErrorOverlay()}
        {this.renderMapMarkerOverlay()}
        {this.renderFloorOverlay()}
        {this.renderTagListOverlay()}
        <FloorAndTagControls
          showFloors={this.shouldShowFloors()}
          showTagList={showTagsControl && loadTags}
          toggleFloorOverlay={this.toggleFloorOverlay}
          toggleTagListOverlay={this.toggleTagListOverlay}
          toggleLoadingSpinner={this.toggleLoadingSpinner}
          toggleErrorOverlay={this.toggleErrorOverlay}
        />
        {this.renderFloorLabel()}
        <div
          ref={el => {
            this.mapRef = el;
          }}
          className={cx("meridian-map-background", cssMap)}
          onClick={this.onClick}
          style={{ width, height }}
        >
          <div
            style={{
              position: "relative",
              transform: mapTransform,
              transformOrigin: "0 0 0"
            }}
          >
            <img
              src={mapImageURL}
              ref={el => {
                this.mapImage = el;
              }}
            />
            {errors.length === 0 && mapData ? (
              <Fragment>
                <OverlayLayer
                  mapZoomFactor={mapZoomFactor}
                  overlays={overlays}
                />
                {this.props.loadPlacemarks ? (
                  <PlacemarkLayer
                    selectedItem={selectedItem}
                    isPanningOrZooming={isPanningOrZooming}
                    mapZoomFactor={mapZoomFactor}
                    locationID={locationID}
                    floorID={floorID}
                    api={api}
                    markers={placemarks}
                    onMarkerClick={this.onMarkerClick}
                    toggleLoadingSpinner={this.toggleLoadingSpinner}
                    placemarks={this.state.placemarks}
                    onUpdate={onPlacemarksUpdate}
                  />
                ) : null}
                {this.props.loadTags ? (
                  <TagLayer
                    selectedItem={selectedItem}
                    isPanningOrZooming={isPanningOrZooming}
                    mapZoomFactor={mapZoomFactor}
                    locationID={locationID}
                    floorID={floorID}
                    api={api}
                    markers={tags}
                    onMarkerClick={this.onMarkerClick}
                    onUpdate={onTagsUpdate}
                    toggleLoadingSpinner={this.toggleLoadingSpinner}
                  />
                ) : null}
                <AnnotationLayer
                  mapZoomFactor={mapZoomFactor}
                  annotations={annotations}
                />
              </Fragment>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
