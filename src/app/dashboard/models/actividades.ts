export interface IActividadesDet {
    id: number
    foto: string
    fecha: Date
    tipo_mantenimiento: string
    limpieza: string
    sistema_operativo: string
    archivos: string
    hardware: string
    software: string
    encargado: string
    tecnico: string
    supervisor: string
    observaciones: string
    mantenimiento_id: number
    mantenimiento?: {
        id: number
        estado: string
        fecha: string
        observaciones: string
        activo_id: string
        activo?: {
            id: number
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
            fecha: string
            descripcion: string
            tipo: string
        }
    }
}

export interface IActividadPost {
    tipo_mantenimiento: string
    limpieza: string
    sistema_operativo: string
    archivos: string
    hardware: string
    software: string
    encargado: string
    tecnico: string
    supervisor: string
    observaciones: string
    mantenimiento_id: number
}