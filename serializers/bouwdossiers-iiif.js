#!/usr/bin/env node

// Draft: script to convert bouwdossiers to IIIF collection.

const R = require('ramda')
const H = require('highland')

const fetch = require('../lib/cached-fetch')

function createIiifUrl (url) {
  const namespace = 'edepot'
  const id = url.replace('https://BWT.Uitplaatsing.hcp-a.basis.lan/rest/', '')
  return `https://acc.images.data.amsterdam.nl/iiif/2/${namespace}:${encodeURIComponent(id)}`
}

async function getDimensions (iiifUrl) {
  const info = await fetch(`${iiifUrl}/info.json`)
  return [info.width, info.height]
}

async function transform (bouwdossier) {
  return {
    '@context': 'http://iiif.io/api/presentation/2/context.json',
    '@id': `https://api.data.amsterdam.nl/api/stadsarchief/bouwdossiers/${bouwdossier.dossiernummer}`,
    '@type': 'sc:Manifest',
    label: 'Bouwdossier',
    sequences: [
      {
        '@type': 'sc:Sequence',
        '@id': `https://api.data.amsterdam.nl/api/stadsarchief/bouwdossiers/${bouwdossier.dossiernummer}/sequence`,
        canvases: await Promise.all(bouwdossier.subdossiers.map(R.prop('bestanden')).flat()
          .map(async (url, index) => {
            const iiifUrl = createIiifUrl(url)

            let dimensions
            try {
              dimensions = await getDimensions(iiifUrl)
            } catch (err) {
              console.error(`Can't fetch info.json for ${url}`)
              return
            }

            const [width, height] = dimensions
            return {
              '@id': `https://api.data.amsterdam.nl/api/stadsarchief/bouwdossiers/${bouwdossier.dossiernummer}/canvas/${index}`,
              '@type': 'sc:Canvas',
              height,
              width,
              label: index,
              images: [
                {
                  '@id': `https://api.data.amsterdam.nl/api/stadsarchief/bouwdossiers/${bouwdossier.dossiernummer}/annotation/${index}`,
                  '@type': 'oa:Annotation',
                  motivation: 'sc:painting',
                  on: `https://api.data.amsterdam.nl/api/stadsarchief/bouwdossiers/${bouwdossier.dossiernummer}/canvas/${index}`,
                  resource: {
                    '@type': 'dctypes:Image',
                    format: 'image/jpeg',
                    height,
                    width,
                    service: {
                      '@context': 'http://iiif.io/api/image/2/context.json',
                      '@id': iiifUrl,
                      profile: 'http://iiif.io/api/image/2/level2.json'
                    }
                  }
                }
              ]
            }
          }).filter(R.identity))
      }
    ]
  }
}

H(process.stdin)
  .split()
  .compact()
  .map(JSON.parse)
  .flatMap((bouwdossier) => H(transform(bouwdossier)))
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(process.stdout)
