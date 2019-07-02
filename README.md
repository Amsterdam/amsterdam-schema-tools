# Amsterdam Schemas

This repository contains a work-in-progress version of the Amsterdam Schema. Currently, Amsterdam Schema is a set of [JSON Schemas](https://json-schema.org/) and meta-schamas. The goal of this project is to describe and validate [open data published by the City of Amsterdam](https://api.data.amsterdam.nl/api/). Amsterdam Schema will be used to make the import, storage and publishing layers of our APIs more generic, easier to maintain, and better documented.

For more information, see:

- [Werkbestand Team Dataservices](https://observablehq.com/@bertspaan/werkbestand-team-dataservices) (in Dutch)
- [Amsterdam Schema Playground](https://observablehq.com/@bertspaan/amsterdam-schema-playground) (in Dutch as well)

## Schemas

You can find a few draft JSON Schemas in the [`schemas`](schemas) directory in this repository.

## Datasets

This repository also contains ETL scripts to import and convert data to conform to these schemas.

Note: all ETL scripts in this repository will output [newline delimited JSON](http://ndjson.org/) (NDJSON).

The [`data`](data) directory contains some sample NDJSON files, the [`geojson`](geojson) directory contains sample GeoJSON data.

To run the ETL scripts, first install the dependencies: `npm install`

### Monumenten

Draft ETL script for Bouwdossiers dataset.

    ./etl-monumenten.js < /path/to/Import_AMISExport.xml > ./data/monumenten.ndjson

### Milieuzones

Draft ETL script for Milieuzones dataset.

Usage:

    curl https://raw.githubusercontent.com/Amsterdam/various_small_datasets/master/src/milieuzones/data/milieuzones.json | ./etl-milieuzones.js > ./data/milieuzones.ndjson

### Bouwdossiers

Draft ETL script for Bouwdossiers dataset.

Usage:

    ./etl-bouwdossiers.js < /path/to/bouwdossiers/SAA_BWT_XML_20190417/SAA_BWT_01.xml > ./data/bouwdossiers.ndjson

### Oplaadpunten

Draft ETL script for Oplaadpunten dataset.

Usage:

    ./etl/oplaadpunten.js > ./data/oplaadpunten.ndjson

## To GeoJSON

Run:

    ./tools/ndjson-to-geojson.js < ./data/oplaadpunten.ndjson | pbcopy

Now you can go to [geojson.io](http://geojson.io/) and paste the data!
