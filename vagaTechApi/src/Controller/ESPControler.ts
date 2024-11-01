import { Request, Response } from 'express';
import { getPlateVehicle } from '../Function/getEspImage';

type Data = {
  detected: boolean,
  ip: string,
}

export class ESPController {

  async receive(req: Request, res: Response) {
    const data: Data = req.body
    console.log(data)

    if (!data.ip) {
      console.error(data, "Faltando dados.")
      return
    }

    if (!data.detected) {
      console.log("Falso");
      res.send("Failed to detect")
      return
    }

    const numberPlate = await getPlateVehicle(data.ip)

    console.log(numberPlate)
    
    res.json({numberPlate}).status(200)
  };
}