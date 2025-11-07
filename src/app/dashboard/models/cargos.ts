import { Data } from "@angular/router"

export interface IcargoIndividual {
  id: number
  descripcoin: string
  area: string
}

export interface IDesignacionCargo {
    id: number
    estado: string
    fecha_inicio:Data
    cargo?: {
        id: number
        descripcion: string
        area: string
    }
}
