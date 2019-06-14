export class UmrnOddsRecord {
    ninkiNo: number;
    umaNo: number;
    umrnOdds: number | null;
    markCd: string | null;
    diffRt: number | null;
    kabeCd: string | null;
    prevUmrnOddsRecord: UmrnOddsRecord = null;
}
