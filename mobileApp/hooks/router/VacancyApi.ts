
import { Api } from '../Api'

interface Vacancy {
  id: string
  status: 0 | 1,
  clientId?: string | null,
  currentVehicleId?: string | null,
  vacancyTypeId: string
  vacancyNumber: number,
}

export const VacancyApi = {
  
  async getAll () {
    const res = await Api.get("/vacancy")

    const data = res.data as Array<Vacancy>;
    return data;
  } 
}