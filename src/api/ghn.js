import instance from "./address";

export const listProvince = () => {
    const params = {
        token_GHN: `d740eabe-369a-11ed-8636-7617f3863de9`,
        shopId_GHN: 3266977,
        fromDistrictId: 3440
    }
    const url = `master-data/province`
    return instance.get(url, { params })
}
export const listDistrict = (idProvince) => {
    const url = `master-data/district?province_id=${idProvince}`
    return instance.get(url)
}
export const listWard = (idDistrict) => {
    const url = `master-data/ward?district_id=${idDistrict}`
    return instance.get(url)
}
