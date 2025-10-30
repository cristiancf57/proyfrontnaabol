export interface IActivo {
    id?:number
    detalle: string
    codigo: string
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

export interface IActivoPost {
    detalle: string
    codigo: number
    marca: string
    modelo: string
    serie: string
    color: string
    area: string
    ip: string
    ubicacion: string
    descripcion: string
    tipo: string
}
export interface IActivoPost1 {
    detalle: string
    codigo: number
    marca: string
    modelo: string
    serie: string
    color: string
    area: string
    ip: string
    ubicacion: string
    descripcion: string
    tipo: string
    fecha: string
    estado: string
}