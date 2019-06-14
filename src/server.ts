import * as Express from 'express';
import * as connPool from './connection-pool';
import * as settings from './settings';
import * as fs from 'fs';
import { RaceSummaryRecord } from './record/race-summary-record';
import { PoolConnection } from 'promise-mysql';
import { OddsTimeRecord } from './record/odds-time-record';
import { UmrnOddsRecord } from './record/umrn-odds-record';
import { KaisaiRecord } from './record/kaisai-record';
import { TanOddsRecord } from './record/tan-odds-record';
import { FukuOddsRecord } from './record/fuku-odds-record';
import { TnpkOddsDiffRecord } from './record/tnpk-odds-diff-record';

const app = Express();
const pool = new connPool.ConnectionPool();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.get('/', (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    return res.send(process.cwd() + ' | ' + __dirname);
});

app.get('/kaisai/dates', (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    let connection: PoolConnection;
    pool.getConnection()
        .then(conn => {
            connection = conn;
            const sql = fs.readFileSync(process.cwd() + '/sql/select_kaisai_dt_list.sql', 'utf8');
            return conn.query(sql);
        })
        .then(rows => {
            const arr: string[] = Array();
            rows.forEach(element => {
                arr.push(element['KAISAI_DT']);
            });
            res.json(arr);
            // return console.log(arr);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({});
        })
        .finally(() => {
            pool.releaseConnection(connection);
        });
});

app.get('/odds/summary/:date', (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    let connection: PoolConnection;
    pool.getConnection()
        .then(conn => {
            connection = conn;
            const sql = fs.readFileSync(process.cwd() + '/sql/select_odds_summary_list.sql', 'utf8');
            return conn.query(sql, [1, req.params.date]);
        })
        .then(rows => {
            const arr: RaceSummaryRecord[] = Array();
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
                arr.push(record);
            });

            res.json(arr);
            // return console.log(arr);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({});
        })
        .finally(() => {
            pool.releaseConnection(connection);
        });
});

app.get('/kaisai/:kaisaiCd', (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    let connection: PoolConnection;
    pool.getConnection()
        .then(conn => {
            connection = conn;
            const sql = fs.readFileSync(process.cwd() + '/sql/select_kaisai_info.sql', 'utf8');
            return conn.query(sql, [req.params.kaisaiCd]);
        })
        .then(rows => {
            const row = rows[0];
            const record = new KaisaiRecord();
            record.kaisaiCd = row['KAISAI_CD'];
            record.kaisaiNm = row['KAISAI_NM'];
            record.kaisaiDt = row['KAISAI_DT'];
            res.json(record);
            // return console.log(record);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({});
        })
        .finally(() => {
            pool.releaseConnection(connection);
        });
});

app.get(
    '/odds/:kaisaiCd/:raceNo/odds-times',
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        let connection: PoolConnection;
        pool.getConnection()
            .then(conn => {
                connection = conn;
                const sql = fs.readFileSync(process.cwd() + '/sql/select_odds_time_list.sql', 'utf8');
                return conn.query(sql, [req.params.kaisaiCd, req.params.raceNo]);
            })
            .then(rows => {
                const arr: OddsTimeRecord[] = new Array();
                rows.forEach(element => {
                    const record = new OddsTimeRecord();
                    record.oddsTimeNo = element['ODDS_TIME_NO'];
                    record.tnpkOddsTime = element['TNPK_ODDS_TIME'];
                    record.umrnOddsTime = element['UMRN_ODDS_TIME'];
                    arr.push(record);
                });
                res.json(arr);
                // return console.log(arr);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({});
            })
            .finally(() => {
                pool.releaseConnection(connection);
            });
    },
);

app.get(
    '/odds/:kaisaiCd/:raceNo/:oddsTimeNo/tan',
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        let connection;
        const kaisaiCd = req.params.kaisaiCd,
            raceNo = req.params.raceNo,
            oddsTimeNo = req.params.oddsTimeNo;
        pool.getConnection()
            .then(conn => {
                connection = conn;
                const sql = fs.readFileSync(process.cwd() + '/sql/select_odds_umrn_rank1_list.sql', 'utf8');
                return conn.query(sql, [kaisaiCd, raceNo, oddsTimeNo, kaisaiCd, raceNo, oddsTimeNo]);
            })
            .then(rows => {
                const umaNo = rows[0]['UMA_NO'];
                const sql = fs.readFileSync(process.cwd() + '/sql/select_odds_tan_list.sql', 'utf8');
                return connection.query(sql, [
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
            })
            .then(rows => {
                const arr: TanOddsRecord[] = new Array();
                rows.forEach(data => {
                    const record = new TanOddsRecord();
                    record.ninkiNo = data['NINKI_NO'];
                    record.umaNo = data['UMA_NO'];
                    record.tanOdds = data['TAN_ODDS'];
                    const umrnNinkiNo: number = data['UMRN_NINKI_NO'];
                    record.idoFlg = record.ninkiNo <= umrnNinkiNo - 5;
                    arr.push(record);
                });
                res.json(arr);
                // return console.log(arr);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({});
            })
            .finally(() => {
                pool.releaseConnection(connection);
            });
    },
);

app.get(
    '/odds/:kaisaiCd/:raceNo/:oddsTimeNo/fuku',
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        let connection;
        const kaisaiCd = req.params.kaisaiCd,
            raceNo = req.params.raceNo,
            oddsTimeNo = req.params.oddsTimeNo;
        pool.getConnection()
            .then(conn => {
                connection = conn;
                const sql = fs.readFileSync(process.cwd() + '/sql/select_odds_umrn_rank1_list.sql', 'utf8');
                return conn.query(sql, [kaisaiCd, raceNo, oddsTimeNo, kaisaiCd, raceNo, oddsTimeNo]);
            })
            .then(rows => {
                const umaNo = rows[0]['UMA_NO'];
                const sql = fs.readFileSync(process.cwd() + '/sql/select_odds_fuku_list.sql', 'utf8');
                return connection.query(sql, [
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
            })
            .then(rows => {
                const arr: FukuOddsRecord[] = new Array();
                rows.forEach(data => {
                    const record = new FukuOddsRecord();
                    record.ninkiNo = data['NINKI_NO'];
                    record.umaNo = data['UMA_NO'];
                    record.fukuOdds = data['FUKU_ODDS_MAX'];
                    const umrnNinkiNo: number = data['UMRN_NINKI_NO'];
                    record.idoFlg = record.ninkiNo <= umrnNinkiNo - 5;
                    arr.push(record);
                });
                res.json(arr);
                // return console.log(arr);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({});
            })
            .finally(() => {
                pool.releaseConnection(connection);
            });
    },
);

app.get(
    '/odds/:kaisaiCd/:raceNo/:oddsTimeNo/umrn',
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        let connection;
        const kaisaiCd = req.params.kaisaiCd,
            raceNo = req.params.raceNo,
            oddsTimeNo = req.params.oddsTimeNo;
        pool.getConnection()
            .then(conn => {
                connection = conn;
                const sql = fs.readFileSync(process.cwd() + '/sql/select_odds_umrn_rank1_list.sql', 'utf8');
                return conn.query(sql, [kaisaiCd, raceNo, oddsTimeNo, kaisaiCd, raceNo, oddsTimeNo]);
            })
            .then(rows => {
                const umaNo = rows[0]['UMA_NO'];
                const sql = fs.readFileSync(process.cwd() + '/sql/select_odds_umrn_list.sql', 'utf8');
                return connection.query(sql, [
                    kaisaiCd,
                    raceNo,
                    oddsTimeNo,
                    umaNo,
                    kaisaiCd,
                    raceNo,
                    oddsTimeNo,
                    umaNo,
                    umaNo,
                ]);
            })
            .then(rows => {
                const arr: UmrnOddsRecord[] = new Array();
                let prevRecord: UmrnOddsRecord = null;
                rows.forEach(element => {
                    const record: UmrnOddsRecord = new UmrnOddsRecord();
                    record.ninkiNo = element['NINKI_NO'];
                    record.umaNo = element['UMA_NO'];
                    record.umrnOdds = element['UMRN_ODDS'];
                    record.prevUmrnOddsRecord = prevRecord;
                    arr.push(record);
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
                res.json(arr);
                // return console.log(arr);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({});
            })
            .finally(() => {
                pool.releaseConnection(connection);
            });
    },
);

app.get(
    '/odds/:kaisaiCd/:raceNo/:oddsTimeNo/diff',
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        let connection;
        const kaisaiCd = req.params.kaisaiCd,
            raceNo = req.params.raceNo,
            oddsTimeNo = req.params.oddsTimeNo;
        pool.getConnection()
            .then(conn => {
                connection = conn;
                const sql = fs.readFileSync(process.cwd() + '/sql/select_odds_tnpk_time_diff.sql', 'utf8');
                return conn.query(sql, [kaisaiCd, raceNo, oddsTimeNo - 1, oddsTimeNo]);
            })
            .then(rows => {
                const arr: TnpkOddsDiffRecord[] = new Array();
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
                    arr.push(record);
                });
                res.json(arr);
                return console.log(arr);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({});
            })
            .finally(() => {
                pool.releaseConnection(connection);
            });
    },
);

app.listen(3000, () => {
    pool.createPool(
        settings.DatabaseSettings.HOST,
        settings.DatabaseSettings.USER,
        settings.DatabaseSettings.PASSWORD,
        settings.DatabaseSettings.DATABASE,
        settings.DatabaseSettings.CONNECTION_LIMIT,
    )
        .then(() => {
            console.log('listening on port 3000...');
        })
        .catch(err => {
            throw err;
        });
});
export default app;
