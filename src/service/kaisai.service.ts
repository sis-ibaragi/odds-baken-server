import * as Express from 'express';
import * as fs from 'fs';
import { ConnectionPool } from '../connection-pool';
import { KaisaiRecord } from '../record/kaisai-record';
import { RaceSummaryRecord } from '../record/race-summary-record';

export class KaisaiService {
    constructor(private connPool: ConnectionPool) {}

    async getKaisaiDates(req: Express.Request, res: Express.Response): Promise<string[]> {
        let conn;
        try {
            conn = await this.connPool.getConnection();
            const sql = fs.readFileSync(process.cwd() + '/sql/select_kaisai_dt_list.sql', 'utf8');
            const rows = await conn.query(sql);
            const list: string[] = Array();
            rows.forEach(row => {
                list.push(row['KAISAI_DT']);
            });
            return list;
        } catch (error) {
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }

    async getKaisaiSummary(req: Express.Request, res: Express.Response): Promise<RaceSummaryRecord[]> {
        let conn;
        try {
            conn = await this.connPool.getConnection();
            const sql = fs.readFileSync(process.cwd() + '/sql/select_odds_summary_list.sql', 'utf8');
            const rows = await conn.query(sql, [1, req.params.date]);
            const list: RaceSummaryRecord[] = Array();
            rows.forEach(element => {
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
            return list;
        } catch (error) {
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }

    async getKaisaiInfo(req: Express.Request, res: Express.Response): Promise<KaisaiRecord> {
        let conn;
        try {
            conn = await this.connPool.getConnection();
            const sql = fs.readFileSync(process.cwd() + '/sql/select_kaisai_info.sql', 'utf8');
            const rows = await conn.query(sql, [req.params.kaisaiCd]);
            const row = rows[0];
            const record = new KaisaiRecord();
            record.kaisaiCd = row['KAISAI_CD'];
            record.kaisaiNm = row['KAISAI_NM'];
            record.kaisaiDt = row['KAISAI_DT'];
            return record;
        } catch (error) {
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }
}
