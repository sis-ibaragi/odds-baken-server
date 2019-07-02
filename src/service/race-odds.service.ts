import * as fs from 'fs';
import { PoolConnection } from 'promise-mysql';
import { ConnectionPool } from '../connection-pool';
import { OddsTimeRecord } from '../record/odds-time-record';
import { TanOddsRecord } from '../record/tan-odds-record';
import { FukuOddsRecord } from '../record/fuku-odds-record';
import { UmrnOddsRecord } from '../record/umrn-odds-record';
import { TnpkOddsDiffRecord } from '../record/tnpk-odds-diff-record';

export class RaceOddsService {
    constructor(private connPool: ConnectionPool) { }

    async getOddsTimes(kaisaiCd: string, raceNo: number): Promise<OddsTimeRecord[]> {
        let conn!: PoolConnection;
        try {
            conn = await this.connPool.getConnection();
            await conn.beginTransaction();
            const sql = fs.readFileSync(`${process.cwd()}/sql/select_odds_time_list.sql`, 'utf8');
            const rows = await conn.query(sql, [kaisaiCd, raceNo]);
            const list: OddsTimeRecord[] = [];
            rows.forEach((element) => {
                const record = new OddsTimeRecord();
                record.oddsTimeNo = element['ODDS_TIME_NO'];
                record.tnpkOddsTime = element['TNPK_ODDS_TIME'];
                record.umrnOddsTime = element['UMRN_ODDS_TIME'];
                list.push(record);
            });
            await conn.commit();
            return list;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }

    async getTanOdds(kaisaiCd: string, raceNo: number, oddsTimeNo: number): Promise<TanOddsRecord[]> {
        let conn!: PoolConnection;
        try {
            conn = await this.connPool.getConnection();
            await conn.beginTransaction();
            // 馬連オッズ一覧を取得
            const umrnOddsList: UmrnOddsRecord[] = await this.getUmrnOdds(kaisaiCd, raceNo, oddsTimeNo);
            // 馬番をキーに馬連オッズ情報を Map に設定
            const umrnOddsMap: Map<number, UmrnOddsRecord> = new Map();
            umrnOddsList.forEach((row) => {
                umrnOddsMap.set(row.umaNo, row);
            });

            const sql = fs.readFileSync(`${process.cwd()}/sql/select_odds_tan_list.sql`, 'utf8');
            const rows = await conn.query(sql, [kaisaiCd, raceNo, oddsTimeNo]);
            const list: TanOddsRecord[] = [];
            rows.forEach((data) => {
                const record = new TanOddsRecord();
                record.ninkiNo = data['NINKI_NO'];
                record.umaNo = data['UMA_NO'];
                record.tanOdds = data['TAN_ODDS'];
                // 馬連オッズの人気順と 5 以上乖離がある場合は移動フラグを ON にする
                record.idoFlg = record.ninkiNo <= umrnOddsMap.get(record.umaNo).ninkiNo - 5;
                list.push(record);
            });
            await conn.commit();
            return list;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }

    async getFukuOdds(kaisaiCd: string, raceNo: number, oddsTimeNo: number): Promise<FukuOddsRecord[]> {
        let conn!: PoolConnection;
        try {
            conn = await this.connPool.getConnection();
            await conn.beginTransaction();
            // 馬連オッズ一覧を取得
            const umrnOddsList: UmrnOddsRecord[] = await this.getUmrnOdds(kaisaiCd, raceNo, oddsTimeNo);
            // 馬番をキーに馬連オッズ情報を Map に設定
            const umrnOddsMap: Map<number, UmrnOddsRecord> = new Map();
            umrnOddsList.forEach((row) => {
                umrnOddsMap.set(row.umaNo, row);
            });

            const sql = fs.readFileSync(`${process.cwd()}/sql/select_odds_fuku_list.sql`, 'utf8');
            const rows = await conn.query(sql, [kaisaiCd, raceNo, oddsTimeNo]);
            const list: FukuOddsRecord[] = [];
            let prevRecord: FukuOddsRecord;
            let count: number = 0;
            let ninkiNo: number = 1;
            rows.forEach((data) => {
                count += 1;
                const record = new FukuOddsRecord();
                record.umaNo = data['UMA_NO'];
                record.fukuOdds = data['FUKU_ODDS_MAX'];
                // 前レコードとオッズが異なる場合は人気順をカウントアップする
                if (prevRecord && prevRecord.fukuOdds !== record.fukuOdds) {
                    ninkiNo = count;
                }
                record.ninkiNo = ninkiNo;
                // 馬連オッズの人気順と 5 以上乖離がある場合は移動フラグを ON にする
                record.idoFlg = record.ninkiNo <= umrnOddsMap.get(record.umaNo).ninkiNo - 5;
                list.push(record);
                // 前レコードを一時保存
                prevRecord = record;
            });
            await conn.commit();
            return list;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }

    async getUmrnOdds(kaisaiCd: string, raceNo: number, oddsTimeNo: number): Promise<UmrnOddsRecord[]> {
        let conn!: PoolConnection;
        try {
            conn = await this.connPool.getConnection();
            await conn.beginTransaction();
            // 馬連 1 位の馬番を取得
            const sql1 = fs.readFileSync(`${process.cwd()}/sql/select_odds_umrn_rank1_list.sql`, 'utf8');
            const rows1 = await conn.query(sql1, [kaisaiCd, raceNo, oddsTimeNo, kaisaiCd, raceNo, oddsTimeNo]);
            const umaNo = rows1[0]['UMA_NO'];

            const sql2 = fs.readFileSync(`${process.cwd()}/sql/select_odds_umrn_list.sql`, 'utf8');
            const rows2 = await conn.query(sql2, [
                kaisaiCd,
                raceNo,
                oddsTimeNo,
                umaNo,
                kaisaiCd,
                raceNo,
                oddsTimeNo,
                umaNo,
                kaisaiCd,
                raceNo,
                umaNo,
            ]);
            const list: UmrnOddsRecord[] = [];
            let prevRecord: UmrnOddsRecord;
            let ninkiNo: number = 1;
            let count: number = 0;
            rows2.forEach((element) => {
                count += 1;
                const record: UmrnOddsRecord = new UmrnOddsRecord();
                record.umaNo = element['UMA_NO'];
                record.umrnOdds = element['UMRN_ODDS'];
                record.markCd = element['MARK_CD'];
                // 前レコードとオッズが異なる場合は人気順をカウントアップする
                if (prevRecord && prevRecord.umrnOdds !== record.umrnOdds) {
                    ninkiNo = count;
                }
                record.ninkiNo = ninkiNo;
                record.prevUmrnOddsRecord = prevRecord;
                list.push(record);
                if (prevRecord
                    && prevRecord.umrnOdds && prevRecord.umrnOdds !== null && record.umrnOdds !== null) {
                    prevRecord.diffRt = record.umrnOdds / prevRecord.umrnOdds;
                    if (prevRecord.ninkiNo <= 8) {
                        prevRecord.kabeCd = prevRecord.diffRt >= 1.8 ? '01' : '';
                    } else {
                        prevRecord.kabeCd = prevRecord.diffRt >= 1.8 ? '10' : '';
                        if (prevRecord.kabeCd !== null) {
                            prevRecord.prevUmrnOddsRecord.kabeCd = prevRecord.kabeCd;
                        }
                    }
                }
                prevRecord = record;
            });
            await conn.commit();
            return list;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }

    async getTnpkOddsDiff(kaisaiCd: string, raceNo: number, oddsTimeNo: number): Promise<TnpkOddsDiffRecord[]> {
        let conn!: PoolConnection;
        try {
            conn = await this.connPool.getConnection();
            await conn.beginTransaction();

            const sql = fs.readFileSync(`${process.cwd()}/sql/select_odds_tnpk_time_diff.sql`, 'utf8');
            const rows = await conn.query(sql, [kaisaiCd, raceNo, oddsTimeNo - 1, oddsTimeNo]);
            const list: TnpkOddsDiffRecord[] = [];
            rows.forEach((data) => {
                const record = new TnpkOddsDiffRecord();
                record.umaNo = data['UMA_NO'];
                record.tanOdds1 = data['TAN_ODDS_1'];
                record.tanOdds2 = data['TAN_ODDS_2'];
                record.fukuOdds1 = data['FUKU_ODDS_MAX_1'];
                record.fukuOdds2 = data['FUKU_ODDS_MAX_2'];
                record.tanUpRt = record.tanOdds1 / record.tanOdds2;
                record.tanUpFlg = record.tanUpRt > 1;
                record.fukuUpRt = record.fukuOdds1 / record.fukuOdds2;
                record.fukuUpFlg = record.fukuUpRt > 1;
                list.push(record);
            });
            await conn.commit();
            return list;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }

    async postRaceUmaMark(kaisaiCd: string, raceNo: number, umaNo: string, markCd: string): Promise<void> {
        let conn!: PoolConnection;
        try {
            conn = await this.connPool.getConnection();
            await conn.beginTransaction();
            const sql = fs.readFileSync(`${process.cwd()}/sql/insert_race_uma_mark.sql`, 'utf8');
            await conn.query(sql, [kaisaiCd, raceNo, umaNo, markCd, markCd]);
            await conn.commit();
            return;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }
}
