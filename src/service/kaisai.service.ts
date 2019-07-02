import * as fs from 'fs';
import { PoolConnection } from 'promise-mysql';
import { ConnectionPool } from '../connection-pool';
import { KaisaiRecord } from '../record/kaisai-record';
import { RaceSummaryRecord } from '../record/race-summary-record';

export class KaisaiService {
    constructor(private connPool: ConnectionPool) { }

    async getKaisaiDates(): Promise<string[]> {
        let conn!: PoolConnection;
        try {
            conn = await this.connPool.getConnection();
            await conn.beginTransaction();
            const sql = fs.readFileSync(`${process.cwd()}/sql/select_kaisai_dt_list.sql`, 'utf8');
            const rows = await conn.query(sql);
            const list: string[] = Array();
            rows.forEach((row) => {
                list.push(row['KAISAI_DT']);
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

    async getKaisaiSummary(kaisaiDt: string, oddsTimeNo: number): Promise<RaceSummaryRecord[]> {
        let conn!: PoolConnection;
        try {
            conn = await this.connPool.getConnection();
            await conn.beginTransaction();
            const sql = fs.readFileSync(`${process.cwd()}/sql/select_odds_summary_list.sql`, 'utf8');
            const rows = await conn.query(sql, [oddsTimeNo, kaisaiDt]);
            const list: RaceSummaryRecord[] = Array();
            rows.forEach((element) => {
                const record = new RaceSummaryRecord();
                record.kaisaiCd = element['KAISAI_CD'];
                record.kaisaiNm = element['KAISAI_NM'];
                record.raceNo = element['RACE_NO'];
                record.umaCnt = element['UMA_NUM'];
                record.tnpkOddsTime = element['TNPK_ODDS_TIME'];
                record.umrnOddsTime = element['UMRN_ODDS_TIME'];
                record.umrn1Odds = element['UMRN_ODDS'];
                record.tan10Odds = element['TAN_ODDS'];
                record.fuku8Odds = element['FUKU_ODDS_MAX'];
                record.umrnAnaFlg = element['UMRN_FLG'] === 1 ? true : false;
                record.tanAnaFlg = element['TAN_FLG'] === 1 ? true : false;
                record.fukuAnaFlg = element['FUKU_FLG'] === 1 ? true : false;
                if (record.umrnAnaFlg && record.tanAnaFlg && record.fukuAnaFlg) {
                    record.anaFlgCnt = 3;
                } else if (record.umrnAnaFlg && record.tanAnaFlg) {
                    record.anaFlgCnt = 2;
                } else if ((record.umrnAnaFlg || record.tanAnaFlg) && record.fukuAnaFlg) {
                    record.anaFlgCnt = 1.5;
                } else if (record.umrnAnaFlg || record.tanAnaFlg) {
                    record.anaFlgCnt = 1;
                }
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

    async getKaisaiInfo(kaisaiCd: string): Promise<KaisaiRecord> {
        let conn!: PoolConnection;
        try {
            conn = await this.connPool.getConnection();
            await conn.beginTransaction();
            const sql = fs.readFileSync(`${process.cwd()}/sql/select_kaisai_info.sql`, 'utf8');
            const rows = await conn.query(sql, [kaisaiCd]);
            const row = rows[0];
            const record = new KaisaiRecord();
            record.kaisaiCd = row['KAISAI_CD'];
            record.kaisaiNm = row['KAISAI_NM'];
            record.kaisaiDt = row['KAISAI_DT'];
            await conn.commit();
            return record;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }
}
