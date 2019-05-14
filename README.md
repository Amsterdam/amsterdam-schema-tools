# schemas

TODO:

- Make base schema:
    - All objects must have ID!
    - Authorization
    - Created, last updated,
    - Type
    - Fields like:
        - `AanmaakDatum`
        - `AanmaakGebruiker`
        - `MutatieDatum`
        - `MutatieGebruiker`

## Datasets

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

    ./etl-oplaadpunten.js > ./data/oplaadpunten.ndjson

## To GeoJSON

Run:

    ./tools/ndjson-to-geojson.js < ./data/oplaadpunten.ndjson | pbcopy