import { Api } from '../Api'

interface Client {
  id: string,
  name: string,
  cpf: string,
  monthlyPayer: boolean,
}

interface Vehicle {
  id: string,
  plate: string,
  clientId: string,
  currentVacancyId: string | null,
  client: Client,
}


export const VehicleApi = {

  async getById (id: string){
    console.log("teste")
    const res = await Api.get(`/vehicle?id=${id}`);

    const data = res.data as Vehicle;
    return data;

  }
  
}