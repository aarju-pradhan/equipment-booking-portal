export const NSW_CAMPUSES = [
    {
        id: 'miller',
        name: 'NSW – Miller Street Campus',
        address: 'Level 5, 213 Miller Street, North Sydney NSW 2060',
        lat: -33.8349,
        lng: 151.2072
    },
    {
        id: 'north-sydney',
        name: 'NSW – North Sydney Campus',
        address: '116 Pacific Highway, North Sydney NSW 2060',
        lat: -33.8390,
        lng: 151.2075
    },
    {
        id: 'cbd',
        name: 'NSW – CBD Campus',
        address: 'Level 11, 307 Pitt Street, Sydney NSW 2000',
        lat: -33.8732,
        lng: 151.2080
    },
    {
        id: 'hurstville',
        name: 'NSW – Hurstville Campus',
        address: '2 Woodville Street, Hurstville NSW 2200',
        lat: -33.9676,
        lng: 151.1028
    }
];

export function getCampus(campusId) {
    return NSW_CAMPUSES.find((campus) => campus.id === campusId) || NSW_CAMPUSES[0];
}
