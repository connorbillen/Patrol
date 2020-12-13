import { readFileSync } from 'fs'
import { parseString } from 'xml2js'

const convertDataToJSON = (): Object => {
    const xml: string = readFileSync(`${ process.cwd() }/src/data/cville_bike_data/data.kml`).toString()
    const jsonData: any = {
        time_enabled: false,
        title: 'Charlottesville Bicycle Racks',
        points: []
    }

    parseString(xml, (_err: Error, result: { kml: { Document: Array<any> }}): void => {
        result.kml.Document[0].Folder[0].Placemark.map((placemark) => {
            const latlon: Array<string> = placemark.Point[0].coordinates[0].split(',')
            jsonData.points.push({ lat: parseFloat(latlon[0]), lon: parseFloat(latlon[1]) });
        })
    })

    return jsonData
}

export default convertDataToJSON
