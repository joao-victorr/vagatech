import { Router, Response, Request } from 'express';
import { ESPController } from '../Controller/ESPControler';

const espControler = new ESPController();
const router = Router();

const getPong = (req: Request, res: Response) => {
  res.send("pong");
}



router.get("/ping", getPong);

router.post("/detectedVehicle", espControler.receive);

export { router };
