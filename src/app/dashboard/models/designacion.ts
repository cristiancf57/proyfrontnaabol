import { Data } from "@angular/router"

export interface IDesignacionPost{
    estado: string
    fecha_inicio: Date
    fecha_fin: Date
    role: number
    usuario_id: number
    cargo_id: number
}

export interface IDesignacion {
    id: number
    estado: string
    fecha_inicio: Data
    role:string
    cargo?: {
      id: number
      descripcion: string
      area: string
    }
}