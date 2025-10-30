export interface ICalendario {
    id: number
    fecha: Date
    observaciones: string
    estado: string
    activo: {
        detalle: string
        tipo: string
    }
}