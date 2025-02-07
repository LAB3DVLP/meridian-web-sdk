# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2022-07-13

### Changed

- Fetch assets for SearchOverlay after floor specific assets have loaded

### Added

- Re-center map when the container size changes

## [1.5.1] - 2022-06-23

### Changed

- Update interval for showing Tag location updates is now 5000ms

### Added

- Option to change the interval for Tag location updates. Default is 5000 (ms)

### Fixed

- Bug where Tags could appear on the wrong floor

## [1.5.0] - 2022-06-17

- Cypress test for Demo of lat/lng to Meridian Map points
- Remove pan limiting (translateExtent) related code
- Dependency updates and security audit

## [1.4.0] - 2022-05-17

### Changed

- Placemark Details Overlay, output placemark type (type_name) when name is not specified

### Added

- New Annotation Demo and associated functionality for converting real-world coordinates
  (lat/lng) to Meridian Map x/y points

## [1.3.0] - 2022-04-29

### Added

- Directions Overview demo showing how to use the Directions API
  to display a route that navigates across multiple floors

## [1.2.1] - 2022-04-25

- SearchOverlay, align radio buttons with labels
- async package patch

## [1.2.0] - 2022-04-06

### Added

- New demo for adding an annotation point identifying where a user/viewer is, such as at a kiosk

- SVG styling and presentation attributes for Overlay Polygons and Polylines.
  Usage examples can be found in the Overlay Polygon and Polyline demos.

  - strokeDasharray (stroke-dasharray)
  - strokeDashoffset (stroke-dashoffset)
  - strokeOpacity (stroke-opacity)
  - fill
  - fillOpacity (fill-opacity)
  - animation
  - style
  - id
  - className (class)

## [1.1.1] - 2022-03-17

- Change `master` branch name and all references to `main`

## [1.1.0] - 2022-03-09

### Added

- New resource options (`resourceIDs`, `resourceType`) added to `api.openStream()`
  for tracking Zone updates. See "api.openStream(), Tag Zone" demo.

## [1.0.2] - 2022-02-17

### Fixed

- Issue where unnamed Tags could cause an empty list in the Asset List Overlay.

## [1.0.1] - 2022-02-16

### Fixed

- Issue where unnamed Placemarks could cause an empty list in the Asset List Overlay.

## [1.0.0] - 2022-02-09

### Removed

- **(BREAKING)** The `showTagsControl` option was removed. This was used to
  hide the button that opened the Tags List Overlay. See `showSearchControl`
  below for an alternate option.

- The Tag List Overlay is now part of a new Asset List Overlay. See below.

### Added

- `api.fetchPlacemarksByLocation()`

- Placemark search functionality (see below)

- Asset List (search) Overlay. This replaces the Tag List Overlay and provides the
  ability to also search for Placemarks.

- `showSearchControl`. This can be used to hide the search icon that opens the
  Asset List overlay

- Demo showing how to hide the Floor menu icon that opens the Floor Switcher

- Demo showing how to hide the Search menu icon that opens the new Asset List (search) Overlay

- `api.getDirections()` (see Directions Overview demo below)

- Directions Overview demo showing how to use the Directions API to display a route

## [0.28.2] - 2021-12-06

### Updated

- Dependency updates

## [0.27.0] - 2021-11-08

### Added

- Added notes for styling a Placemark or Tag label with special characters

## [0.26.0] - 2021-10-25

- Dependency updates

## [0.25.0] - 2021-09-08

### Fixed

- Annotation Points: Map Annotation Points are now properly centered by their x,y.

## [0.24.0] - 2021-08-18

### Updated

- Upgrade webpack, related dependencies and loaders (#275)

## [0.23.0] - 2021-07-20

### Added

- Placemark Category selectors `body .meridian-placemark-category-{CATEGORY_NAME}`
- Added additional example for styling a Placemark based on Category name.

## [0.22.0] - 2021-06-03

### Fixed

- Issue where Label Placemarks (Label only) would not appear regardless of zoom level.

## [0.21.0] - 2021-05-28

### Added

- Click handlers for annotation points and polygon overlays

## [0.20.0] - 2021-05-07

### Fixed

- Chrome Zoom related issue that caused annotations to be misaligned
  when the Zoom level was not 100%

## [0.19.0] - 2021-04-26

### Added

- Demo (Load Tags) to show how to avoid loading Tags. This is
  especially helpful for customers without the Tags SKU.

## [0.18.0] - 2021-04-12

### Added

- Limit panning so users can't drag the map out of view

## [0.17.0] - 2021-04-07

### Changed

- Updated default zoom level and map centering to better accommodate
  widely differing map and container sizes.

## [0.16.0] - 2021-04-01

### Added

- `placemarks.labelZoomLevel` Zoom level at which placemark labels appear when
  label mode is set to "zoom" (defaults to `0.2`)

## [0.15.0] - 2021-03-15

### Changed

- Placemarks no longer shrink when zoomed out

### Added

- `placemarks.labelMode` setting with `always`, `never`, `hover`, and `zoom`
  values (defaults to `zoom`)

## [0.14.0] - 2021-03-02

### Fixed

- An issue where placemarks and tags near the top left were unclickable

### Changed

- Upgraded the map SVG for the examples

### Added

- `onMapClick()` option which is called when the map is clicked
- `TagData` interface (replaces `Record<string, any>`)
- `PlacemarkData` interface (replaces `Record<string, any>`)
- `FloorData` interface (replaces `Record<string, any>`)
- `LocationData` interface (replaces `Record<string, any>`)

### Removed

- Removed undocumented and unsupported option `onMarkerClick`

## [0.13.1] - 2021-02-19

### Fixed

- An issue where an HTTP 401 related message would log to the console; now we
  give a helpful suggestion to use `loadTags: false` in this scenario

- The "basic" demo didn't work correctly

## [0.13.0] - 2021-02-17

### Added

- `loadTags: false` option to avoid loading tags

### Fixed

- An issue where a loading spinner would stay indefinitely when using the Web
  SDK on a location without access to tags

## [0.12.3] - 2021-02-17

### Changed

- Updated API documentation formatting for code examples
- Overlay polygons are now drawn as `<polygon>` instead of `<path>`

## [0.12.2] - 2021-02-11

### Changed

- Online demos use a snapshot of data now for a more consistent experience

## [0.12.1] - 2021-02-08

### Fixed

- Console error: `placemarkIconURL: no such icon 'label_department'`

## [0.12.0] - 2021-02-08

### Added

- `MeridianSDK.placemarkIconURL(type)` return URL to an icon representing the
  given placemark type
- `onPlacemarksUpdate({ allPlacemarks, filteredPlacemarks })` callback to
  `createMap`
- `overlays` array in `createMap`, to draw custom polygons or polylines over the
  map
- `onFloorChange` callback in `createMap`
- `annotations` array in `createMap`, to draw custom images and text

## [0.11.0] - 2020-11-19

### Added

- `map.destroy()` is now optional; a `MeridianMap` can detect being disconnected
  from the DOM and automatically destroy itself

## [0.10.0] - 2020-11-19

### Added

- `map.destroy()` method which should be called when you're done with a map, to
  close network connections (e.g. in a single page app, or when using JS that
  removes the map container from the DOM, or replaces its contents via
  `innerHTML`)

## [0.9.0] - 2020-11-06

### Fixed

- Unpublished floors are now hidden from the floor selector and tags list
- Placemarks wouldn't update after changing floors
- `loadPlacemarks` didn't work correctly

### Added

- `api.fetchTagsByFloor()`
- `api.fetchTagsByLocation()`
- `api.fetchPlacemarksByFloor()`
- `api.fetchFloorsByLocation()`
- `api.fetchSVG()`

### Changed

- `api.token` is now read-only
- `api.environment` is now read-only

### Deprecated

- `api.axios`

## [0.8.1] - 2020-09-09

### Fixed

- `locationID` can now be changed after calling `createMap`

- Exclusion zones are now hidden

### Documentation

- Adds an Example, titled "Tag/Marker click, prevent default and show additional options", to demo customization of a Tag/Marker click callback -- overriding the default modal, and showing marker data in a sidebar

## [0.8.0] - 2020-07-23

### Added

- Option `loadPlacemarks` that when false causes the map to not load
  placemark data (defaults to `true`; it can be updated via `update` to true
  later if you want to load the data at a later time)

## [0.7.8] - 2020-06-26

### Added

- Placemark ID selectors `.meridian-placemark-icon[data-meridian-placemark-id="..."]`

- Tag ID selectors `.meridian-tag[data-meridian-tag-id="..."]`

- An example for styling a specific placemark called "Placemark Customization"

### Changed

- Replaced inline styles with CSS Custom Properties for easier customization of
  Placemarks and Tags

## [0.7.7] - 2020-06-08

### Changed

- Updates documentation for `onTagsUpdate` to clarify it only receives tags for
  the current floor

## [0.7.6] - 2020-05-15

### Added

- Descriptions to examples page

## [0.7.5] - 2020-05-11

### Added

- More examples to documentation

## [0.7.4] - 2020-05-07

### Fixed

- An internal code crash

## [0.7.3] - 2020-05-05

### Fixed

- Download link now points directly to unpkg

## [0.7.2] - 2020-05-05

- Fixes broken links

## [0.7.1] - 2020-05-05

### Added

- Exposes the `API` class directly so you can use `new API(options)` instead of `createAPI(options)`

### Changed

- Deprecates `createAPI(options)`

- Switches to TypeDoc for documentation

## [0.7.0] - 2020-04-10

### Changed

- **(BREAKING)** Tag data returned from API has a new schema

  - `tag.editor_data.tags` is now `tag.tags`

  - `tag.editor_data.is_control_tag` is now `tag.is_control_tag`

  - `tag.calculations.default.location.x` is now `tag.x`

  - `tag.calculations.default.location.y` is now `tag.y`

  - any other fields from `tag.editor_data` and `tag.calculations` have been
    moved up to the top level of the `tag` object

  - This may affect your SDK usage if you use the following callbacks:

    - Methods on the stream returned from `openStream()`

      - `stream.onInitialTags()`
      - `stream.onTagLeave()`
      - `stream.onTagUpdate()`

    - The options callbacks to `createMap()`

      - `onTagClick()`
      - `onTagsUpdate()`
      - `tags.filter()`

- Switched TypeScript compiler to target ES2017

### Fixed

- Tag labels wouldn't line wrap in the tag list

- Placemarks didn't hide while loading placemarks for a new
  floor

- Map images didn't hide while loading the map image for a new
  floor

- A few race conditions involving incorrect data appearing onscreen when
  switching floors quickly

## [0.6.0] - 2020-03-26

### Added

- TypeScript support

### Changed

- `MeridianSDK.restrictedPanZoom` now supports any modifier key, not just Shift

### Fixed

- `onTagUpdate` was not called from `createAPI`

- Bug: If `showTagsControl` was false, all control tags would be
  hidden on the map

- The map background image would fail to load unless the user
  also had access to [edit.meridianapps.com](https://edit.meridianapps.com).

## [0.5.0] - 2019-02-25

### Added

- `onTagClick(data, options)` - (optional) callback function called
  whenever a tag is clicked, receiving the tag data and an options object. The
  options object contains a `preventDefault` function. Call
  `options.preventDefault()` to prevent the overlay from appearing.

- `onPlacemarkClick(data, options)` - (optional) callback function called
  whenever a placemark is clicked, receiving the tag data and an options object.
  The options object contains a `preventDefault` function. Call
  `options.preventDefault()` to prevent the overlay from appearing.

## [0.4.1] - 2018-10-03

The differences are compared to the old pre-release beta version.

## Changed

- The `all`, `ids`, `labels`, and `types` props for `tags` and `placemarks` have
  been replaced with a single `filter` function prop for full control over
  filtering behavior

- `onTagsUpdate(tagsByMAC)` is now `onTagsUpdate(tags)`, where `tags` is an
  object with `allTags` and `filteredTags` keys, which point to arrays of tags

- `onFloorsUpdate(floorsByBuilding)` is now `onFloorsUpdate(floors)`, passing an
  array of floors rather than an object

- `onTagDisappear` is now called `onTagLeave`

- Data passed to callbacks follows the same format as the Meridian endpoints now

## Other Releases

Previous releases were internal only and not documented.
