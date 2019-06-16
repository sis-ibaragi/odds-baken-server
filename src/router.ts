import * as Express from 'express';
import { ConnectionPool } from './connection-pool';
import { KaisaiService } from './service/kaisai.service';
import { RaceOddsService } from './service/race-odds.service';

const router = Express.Router();
const connPool: ConnectionPool = new ConnectionPool();
const kaisaiService = new KaisaiService(connPool);
const raceOddsService = new RaceOddsService(connPool);

router.get('/kaisai/dates', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    console.log(req.url + ' was called.');
    try {
        const ret = await kaisaiService.getKaisaiDates(req, res);
        res.json(ret);
    } catch (error) {
        console.error('Error was occurred...', error);
        res.status(500).json({ error });
    }
});

router.get('/kaisai/:date/summary', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    console.log(req.url + ' was called.');
    try {
        const ret = await kaisaiService.getKaisaiSummary(req, res);
        res.json(ret);
    } catch (error) {
        console.error('Error was occurred...', error);
        res.status(500).json({ error });
    }
});

router.get('/kaisai/:kaisaiCd', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    console.log(req.url + ' was called.');
    try {
        const ret = await kaisaiService.getKaisaiInfo(req, res);
        res.json(ret);
    } catch (error) {
        console.error('Error was occurred...', error);
        res.status(500).json({ error });
    }
});

router.get(
    '/race/odds/:kaisaiCd/:raceNo/times',
    async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        console.log(req.url + ' was called.');
        try {
            const ret = await raceOddsService.getOddsTimes(req, res);
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
        console.log(req.url + ' was called.');
        try {
            const ret = await raceOddsService.getTanOdds(req, res);
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
        console.log(req.url + ' was called.');
        try {
            const ret = await raceOddsService.getFukuOdds(req, res);
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
        console.log(req.url + ' was called.');
        try {
            const ret = await raceOddsService.getUmrnOdds(req, res);
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
        console.log(req.url + ' was called.');
        try {
            const ret = await raceOddsService.getTnpkOddsDiff(req, res);
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
        console.log(req.url + ' was called.');
        try {
            const ret = await raceOddsService.postRaceUmaMark(req, res);
            res.json(ret);
        } catch (error) {
            console.error('Error was occurred...', error);
            res.status(500).json({ error });
        }
    },
);

export default router;
