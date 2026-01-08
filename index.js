import fs from "node:fs"
import tiged from "tiged"

async function downloadData() {
  const emitter = tiged('CMSgov/beneficiary-fhir-data/apps/bfd-server/bfd-server-docs/data-dictionary', {
    disableCache: true,
    force: true,
    verbose: true,
  });

  await emitter.clone('.')
}

async function main() {

  await downloadData()

  const basePath = "./data"
  const versions = fs.readdirSync(basePath)

  versions.forEach((v) => {
    const fullPath = `${basePath}/${v}`
    const fileNames = fs.readdirSync(fullPath)
    let typeList = []

    fileNames.forEach((fileName) => {
      let typeName = fileName.match(/(^.*?)\.json/)
      if (typeName) {
        typeList.push(JSON.parse(fs.readFileSync(`${fullPath}/${fileName}`, 'utf8').toString()))
      }
    })


    try {
      console.log(`Writing data-dictionary-${v}.json...`)
      fs.writeFileSync(`data-dictionary-${v}.json`, JSON.stringify(typeList, null, 2));
      console.log(`Success`)
      // file written successfully
    } catch (err) {
      console.error(err);
    }

  })
}

main()