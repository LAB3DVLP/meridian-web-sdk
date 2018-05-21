import _ from "lodash";
import { Component, Prop, State, Element } from "@stencil/core";

const { MeridianWebApi } = global as any;
const { SVG, panZoom } = global as any;
const seconds = s => s * 1000;

interface Tag {
  mac: string;
  x: number;
  y: number;
}

function handleTagClick() {
  let text: HTMLElement = this;
  console.info("clicking the tag");
}

@Component({
  tag: "meridian-map",
  styleUrl: "map.css",
  shadow: false
})
export class MeridianMap {
  @Element() el: HTMLElement;

  @Prop() locationId: string;
  @Prop() floorId: string;

  @State() currentText: string = "";
  @State() svgUrl: string = "";
  @State() tags: Record<string, Tag> = {};
  @State() connection: any = null;
  @State() connectionStatus: string = "Not Connected";

  componentDidUpdate() {
    console.log("Component did update");
  }

  async componentDidLoad() {
    console.info("Component did load");
    const { data } = await MeridianWebApi.floor.get(
      this.locationId,
      this.floorId
    );
    this.svgUrl = data.svg_url;
    this.connectionOpen();
    this.initMapControls();
  }

  connectionClose() {
    this.connection.close();
  }

  connectionOpen() {
    this.connection = MeridianWebApi.floor.listen({
      locationId: this.locationId,
      id: this.floorId,
      onUpdate: data => {
        this.connectionStatus = "Connected";
        const { mac } = data;
        const { x, y } = data.calculations.default.location;
        const tag = { mac, x, y };
        this.tags = { ...this.tags, [mac]: tag };
      },
      onClose: data => {
        console.info("closing connection");
        this.connection = null;
        this.connectionStatus = "Closed";
      }
    });

    setTimeout(() => {
      this.connectionClose();
    }, seconds(60));
  }

  initMapControls() {
    console.info("init map controls");
    console.info("this.el", this.el);
    var element = this.el.querySelector(".svg_parent");
    console.info("element", element);
    // var foo = SVG.adopt(element);
    // foo.panZoom({ zoomMin: 0.25, zoomMax: 20 });
  }

  renderTags() {
    const tags = this.tags;
    return _.keys(tags).map(mac => {
      const t = tags[mac];
      const { x, y } = t;
      return (
        <use
          onClick={handleTagClick}
          className="tag"
          cursor="pointer"
          pointer-events="all"
          fill="black"
          width="123"
          height="123"
          x={x}
          y={y}
          xlinkHref="/assets/tag.svg#tag"
        />
      );
    });
  }

  renderConnectionToggle() {
    if (!this.connection) {
      return (
        <button onClick={() => this.connectionOpen()}>
          Open Connection (refresh data)
        </button>
      );
    } else {
      return (
        <button onClick={() => this.connectionClose()}>Close Connection</button>
      );
    }
  }

  render() {
    return (
      <div>
        <p>
          {this.renderConnectionToggle()}
          <span> Status: {this.connectionStatus}</span>
        </p>
        <div>
          <svg class="map" viewBox="0 0 1700 2200">
            <g class="svg_parent">
              <image
                id="svg_map_image"
                width="1700"
                height="2200"
                xlinkHref={this.svgUrl}
              />
              {this.renderTags()}
            </g>
          </svg>
        </div>
      </div>
    );
  }
}
