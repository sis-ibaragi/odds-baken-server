import * as Express from 'express';
import { ConnectionPool } from './connection-pool';
import { KaisaiService } from './service/kaisai.service';
import { RaceOddsService } from './service/race-odds.service';

const router = Express.Router();
const connPool: ConnectionPool = new ConnectionPool();
const kaisaiService = new KaisaiService(connPool);
const raceOddsService = new RaceOddsService(connPool);

router.get('/kaisai/dates', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    console.log(`${req.url} was called.`);
    try {
        // Service を呼び出す
        const ret = await kaisaiService.getKaisaiDates();
        // 結果を JSON 形式でレスポンスへ書き込む
        res.json(ret);
    } catch (error) {
        console.error('Error was occurred...', error);
        res.status(500).json({ error });
    }
});

router.get(
    '/kaisai/:kaisaiCd/summary',
    async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        console.log(`${req.url} was called.`);
        try {
            // リクエストパラメータを取得
            const kaisaiCd = req.params.kaisaiCd;
            const oddsTimeNo = 1;
            // Service を呼び出す
            const ret = await kaisaiService.getKaisaiSummary(kaisaiCd, oddsTimeNo);
            // 結果を JSON 形式でレスポンスへ書き込む
            res.json(ret);
        } catch (error) {
            console.error('Error was occurred...', error);
            res.status(500).json({ error });
        }
    });

router.get(
    '/kaisai/:kaisaiDt([0-9]{4}-[0-9]{2}-[0-9]{2})',
    async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        console.log(`${req.url} was called.`);
        try {
            // リクエストパラメータを取得
            const kaisaiDt = req.params.kaisaiDt;
            // Service を呼び出す
            const ret = await kaisaiService.getKaisaiList(kaisaiDt);
            // 結果を JSON 形式でレスポンスへ書き込む
            res.json(ret);
        } catch (error) {
            console.error('Error was occurred...', error);
            res.status(500).json({ error });
        }
    });

router.get('/kaisai/:kaisaiCd', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    console.log(`${req.url} was called.`);
    try {
        // リクエストパラメータを取得
        const kaisaiCd = req.params.kaisaiCd;
        // Service を呼び出す
        const ret = await kaisaiService.getKaisaiInfo(kaisaiCd);
        // 結果を JSON 形式でレスポンスへ書き込む
        res.json(ret);
    } catch (error) {
        console.error('Error was occurred...', error);
        res.status(500).json({ error });
    }
});

router.get(
    '/race/odds/:kaisaiCd/:raceNo/times',
    async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        console.log(`${req.url} was called.`);
        try {
            // リクエストパラメータを取得
            const kaisaiCd = req.params.kaisaiCd;
            const raceNo = req.params.raceNo;
            // Service を呼び出す
            const ret = await raceOddsService.getOddsTimes(kaisaiCd, raceNo);
            // 結果を JSON 形式でレスポンスへ書き込む
            res.json(ret);
        } catch (error) {
            console.error('Error was occurred...', error);
            res.status(500).json({ error });
        }
    },
);

router.get(
    '/race/odds/:kaisaiCd/:raceNo/:oddsTimeNo/tan',
    async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        console.log(`${req.url} was called.`);
        try {
            // リクエストパラメータを取得
            const kaisaiCd = req.params.kaisaiCd;
            const raceNo = req.params.raceNo;
            const oddsTimeNo = req.params.oddsTimeNo;
            // Service を呼び出す
            const ret = await raceOddsService.getTanOdds(kaisaiCd, raceNo, oddsTimeNo);
            // 結果を JSON 形式でレスポンスへ書き込む
            res.json(ret);
        } catch (error) {
            console.error('Error was occurred...', error);
            res.status(500).json({ error });
        }
    },
);
router.get(
    '/race/odds/:kaisaiCd/:raceNo/:oddsTimeNo/fuku',
    async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        console.log(`${req.url} was called.`);
        try {
            // リクエストパラメータを取得
            const kaisaiCd = req.params.kaisaiCd;
            const raceNo = req.params.raceNo;
            const oddsTimeNo = req.params.oddsTimeNo;
            // Service を呼び出す
            const ret = await raceOddsService.getFukuOdds(kaisaiCd, raceNo, oddsTimeNo);
            // 結果を JSON 形式でレスポンスへ書き込む
            res.json(ret);
        } catch (error) {
            console.error('Error was occurred...', error);
            res.status(500).json({ error });
        }
    },
);

router.get(
    '/race/odds/:kaisaiCd/:raceNo/:oddsTimeNo/umrn',
    async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        console.log(`${req.url} was called.`);
        try {
            // リクエストパラメータを取得
            const kaisaiCd = req.params.kaisaiCd;
            const raceNo = req.params.raceNo;
            const oddsTimeNo = req.params.oddsTimeNo;
            // Service を呼び出す
            const ret = await raceOddsService.getUmrnOdds(kaisaiCd, raceNo, oddsTimeNo);
            // 結果を JSON 形式でレスポンスへ書き込む
            res.json(ret);
        } catch (error) {
            console.error('Error was occurred...', error);
            res.status(500).json({ error });
        }
    },
);

router.get(
    '/race/odds/:kaisaiCd/:raceNo/:oddsTimeNo/diff',
    async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        console.log(`${req.url} was called.`);
        try {
            // リクエストパラメータを取得
            const kaisaiCd = req.params.kaisaiCd;
            const raceNo = req.params.raceNo;
            const oddsTimeNo = req.params.oddsTimeNo;
            // Service を呼び出す
            const ret = await raceOddsService.getTnpkOddsDiff(kaisaiCd, raceNo, oddsTimeNo);
            // 結果を JSON 形式でレスポンスへ書き込む
            res.json(ret);
        } catch (error) {
            console.error('Error was occurred...', error);
            res.status(500).json({ error });
        }
    },
);

router.post(
    '/race/odds/:kaisaiCd/:raceNo/:umaNo/mark',
    async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        console.log(`${req.url} was called.`);
        try {
            // リクエストパラメータを取得
            const kaisaiCd = req.params.kaisaiCd;
            const raceNo = req.params.raceNo;
            const umaNo = req.params.umaNo;
            const markCd = req.body['markCd'];
            // Service を呼び出す
            const ret = await raceOddsService.postRaceUmaMark(kaisaiCd, raceNo, umaNo, markCd);
            // 結果を JSON 形式でレスポンスへ書き込む
            res.json(ret);
        } catch (error) {
            console.error('Error was occurred...', error);
            res.status(500).json({ error });
        }
    },
);

export default router;
