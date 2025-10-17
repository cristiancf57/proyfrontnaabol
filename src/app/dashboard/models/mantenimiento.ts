export interface IMantenimiento {
    id: number
    iestado: string
    fecha: Date
    observaciones: string
    activo_id: number
}

export interface IMantenimientoDetalle {
    id: number
    estado: string
    fecha: Date
    observaciones: string
    activo?: {
        id:number
        detalle: string
        codigo: number
        marca: string
        modelo: string
        serie: string
        color: string
        area: string
        ip: string
        ubicacion: string
        estado: string
        fecha: Date
        descripcion: string
        tipo: string

    }
}
export interface IMantenimientoPrincipal {
    id: number
    estado: string
    fecha: Date
    observaciones: string
    activo?: {
        id:number
        detalle: string
        codigo: number
        marca: string
        modelo: string
        serie: string
        color: string
        area: string
        ip: string
        ubicacion: string
        estado: string
        fecha: Date
        descripcion: string
        tipo: string

    }
}