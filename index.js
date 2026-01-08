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

  const path = "./data/V2/"
  const fileNames = fs.readdirSync(path)
  let typeList = []

  fileNames.forEach((fileName) => {
    let typeName = fileName.match(/(^.*?)\.json/)
    if (typeName) {
      typeList.push(JSON.parse(fs.readFileSync(path + fileName, 'utf8').toString()))
    }
  })


  try {
    fs.writeFileSync('data-dictionary.json', JSON.stringify(typeList, null, 2));
    // file written successfully
  } catch (err) {
    console.error(err);
  }
}

main()