import * as Express from 'express';
import * as fs from 'fs';
import { ConnectionPool } from '../connection-pool';
import { OddsTimeRecord } from '../record/odds-time-record';
import { TanOddsRecord } from '../record/tan-odds-record';
import { FukuOddsRecord } from '../record/fuku-odds-record';
import { UmrnOddsRecord } from '../record/umrn-odds-record';
import { TnpkOddsDiffRecord } from '../record/tnpk-odds-diff-record';

export class RaceOddsService {
    constructor(private connPool: ConnectionPool) {}

    async getOddsTimes(req: Express.Request, res: Express.Response): Promise<OddsTimeRecord[]> {
        let conn;
        try {
            conn = await this.connPool.getConnection();
            const sql = fs.readFileSync(process.cwd() + '/sql/select_odds_time_list.sql', 'utf8');
            const rows = await conn.query(sql, [req.params.kaisaiCd, req.params.raceNo]);
            const list: OddsTimeRecord[] = new Array();
            rows.forEach(element => {
                const record = new OddsTimeRecord();
                record.oddsTimeNo = element['ODDS_TIME_NO'];
                record.tnpkOddsTime = element['TNPK_ODDS_TIME'];
                record.umrnOddsTime = element['UMRN_ODDS_TIME'];
                list.push(record);
            });
            return list;
        } catch (error) {
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }

    async getTanOdds(req: Express.Request, res: Express.Response): Promise<TanOddsRecord[]> {
        let conn;
        try {
            // リクエストパラメータを取得
            const kaisaiCd = req.params.kaisaiCd;
            const raceNo = req.params.raceNo;
            const oddsTimeNo = req.params.oddsTimeNo;

            conn = await this.connPool.getConnection();
            const sql1 = fs.readFileSync(process.cwd() + '/sql/select_odds_umrn_rank1_list.sql', 'utf8');
            const rows1 = await conn.query(sql1, [kaisaiCd, raceNo, oddsTimeNo, kaisaiCd, raceNo, oddsTimeNo]);
            const umaNo = rows1[0]['UMA_NO'];
            const sql2 = fs.readFileSync(process.cwd() + '/sql/select_odds_tan_list.sql', 'utf8');
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
                oddsTimeNo,
            ]);
            const list: TanOddsRecord[] = new Array();
            rows2.forEach(data => {
                const record = new TanOddsRecord();
                record.ninkiNo = data['NINKI_NO'];
                record.umaNo = data['UMA_NO'];
                record.tanOdds = data['TAN_ODDS'];
                const umrnNinkiNo: number = data['UMRN_NINKI_NO'];
                record.idoFlg = record.ninkiNo <= umrnNinkiNo - 5;
                list.push(record);
            });
            return list;
        } catch (error) {
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }

    async getFukuOdds(req: Express.Request, res: Express.Response): Promise<FukuOddsRecord[]> {
        let conn;
        try {
            // リクエストパラメータを取得
            const kaisaiCd = req.params.kaisaiCd;
            const raceNo = req.params.raceNo;
            const oddsTimeNo = req.params.oddsTimeNo;

            conn = await this.connPool.getConnection();
            const sql1 = fs.readFileSync(process.cwd() + '/sql/select_odds_umrn_rank1_list.sql', 'utf8');
            const rows1 = await conn.query(sql1, [kaisaiCd, raceNo, oddsTimeNo, kaisaiCd, raceNo, oddsTimeNo]);

            const umaNo = rows1[0]['UMA_NO'];
            const sql2 = fs.readFileSync(process.cwd() + '/sql/select_odds_fuku_list.sql', 'utf8');
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
                oddsTimeNo,
            ]);
            const list: FukuOddsRecord[] = new Array();
            rows2.forEach(data => {
                const record = new FukuOddsRecord();
                record.ninkiNo = data['NINKI_NO'];
                record.umaNo = data['UMA_NO'];
                record.fukuOdds = data['FUKU_ODDS_MAX'];
                const umrnNinkiNo: number = data['UMRN_NINKI_NO'];
                record.idoFlg = record.ninkiNo <= umrnNinkiNo - 5;
                list.push(record);
            });
            return list;
        } catch (error) {
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }

    async getUmrnOdds(req: Express.Request, res: Express.Response): Promise<UmrnOddsRecord[]> {
        let conn;
        try {
            // リクエストパラメータを取得
            const kaisaiCd = req.params.kaisaiCd;
            const raceNo = req.params.raceNo;
            const oddsTimeNo = req.params.oddsTimeNo;

            conn = await this.connPool.getConnection();
            const sql1 = fs.readFileSync(process.cwd() + '/sql/select_odds_umrn_rank1_list.sql', 'utf8');
            const rows1 = await conn.query(sql1, [kaisaiCd, raceNo, oddsTimeNo, kaisaiCd, raceNo, oddsTimeNo]);

            const umaNo = rows1[0]['UMA_NO'];
            const sql2 = fs.readFileSync(process.cwd() + '/sql/select_odds_umrn_list.sql', 'utf8');
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
            const list: UmrnOddsRecord[] = new Array();
            let prevRecord: UmrnOddsRecord = null;
            rows2.forEach(element => {
                const record: UmrnOddsRecord = new UmrnOddsRecord();
                record.ninkiNo = element['NINKI_NO'];
                record.umaNo = element['UMA_NO'];
                record.umrnOdds = element['UMRN_ODDS'];
                record.markCd = element['MARK_CD'];
                record.prevUmrnOddsRecord = prevRecord;
                list.push(record);
                if (prevRecord !== null && prevRecord.umrnOdds !== null && record.umrnOdds !== null) {
                    prevRecord.diffRt = record.umrnOdds / prevRecord.umrnOdds;
                    if (prevRecord.ninkiNo <= 8) {
                        prevRecord.kabeCd = prevRecord.diffRt >= 1.8 ? '01' : null;
                    } else {
                        prevRecord.kabeCd = prevRecord.diffRt >= 1.8 ? '10' : null;
                        if (prevRecord.kabeCd !== null) {
                            prevRecord.prevUmrnOddsRecord.kabeCd = prevRecord.kabeCd;
                        }
                    }
                }
                prevRecord = record;
            });

            return list;
        } catch (error) {
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }

    async getTnpkOddsDiff(req: Express.Request, res: Express.Response): Promise<TnpkOddsDiffRecord[]> {
        let conn;
        try {
            // リクエストパラメータを取得
            const kaisaiCd = req.params.kaisaiCd;
            const raceNo = req.params.raceNo;
            const oddsTimeNo = req.params.oddsTimeNo;

            conn = await this.connPool.getConnection();
            const sql = fs.readFileSync(process.cwd() + '/sql/select_odds_tnpk_time_diff.sql', 'utf8');
            const rows = await conn.query(sql, [kaisaiCd, raceNo, oddsTimeNo - 1, oddsTimeNo]);
            const list: TnpkOddsDiffRecord[] = new Array();
            rows.forEach(data => {
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
            return list;
        } catch (error) {
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }

    async postRaceUmaMark(req: Express.Request, res: Express.Response): Promise<void> {
        let conn;
        try {
            // リクエストパラメータを取得
            const kaisaiCd = req.params.kaisaiCd;
            const raceNo = req.params.raceNo;
            const umaNo = req.params.umaNo;
            const markCd = req.body['markCd'];

            conn = await this.connPool.getConnection();
            await conn.beginTransaction();
            const sql = fs.readFileSync(process.cwd() + '/sql/insert_race_uma_mark.sql', 'utf8');
            const rows = await conn.query(sql, [kaisaiCd, raceNo, umaNo, markCd, markCd]);
            await conn.commit();
            return null;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            this.connPool.releaseConnection(conn);
        }
    }
}
