export function GetNation(nation_code: string) {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const nat =  regionNames.of(nation_code)
    return nat;
}