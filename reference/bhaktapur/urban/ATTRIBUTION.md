# Building-map data attribution

[OpenStreetMap contributors](https://www.openstreetmap.org/copyright), licensed under the [Open Database License 1.0](https://opendatacommons.org/licenses/odbl/1-0/).

The original-coordinate database extract is distributed as `src/data/reconstruction/urban-footprints.json`, separately from the application code. Retain its attribution and database licence when redistributing or deriving a database from this extract. The game also displays attribution linking to OpenStreetMap copyright information.

Retrieved 2026-10-13 from:
https://api.openstreetmap.org/api/0.6/map?bbox=85.4265,27.6711,85.42955,27.67335

Raw XML response SHA256: `9cd36e061c71e8231a6d1245cf6d302fd0efc28388de410253a2c30d5b516972`.

Extract preserves latitude/longitude rings, source IDs, versions and edit timestamps for 479 building entities and 21 street ways. Edited/rendered local geometry is not substituted for this source database. Contributor mapping is not survey verification.

Reference photographs were inspected for architectural evidence, not bundled as application textures. Authors, dates and source links are recorded in `src/data/reconstruction/urban-occupancy-audit.ts`.
