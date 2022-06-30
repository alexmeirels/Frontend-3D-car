import data from '../data/frontend_data_gps.json'

export const getStopPointCoordinate = (index) => {
    return data.courses[index].stop_points.coordinates
}

export const getGpsPosition = (index, time) => {
    return data.courses[index].gps[time]
}

export const getGpsLength = (index) => {
    return data.courses[index].gps.length
}

