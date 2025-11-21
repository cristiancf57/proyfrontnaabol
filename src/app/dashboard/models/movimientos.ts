export interface IMovimientoPost {
    tipo_movimiento: string
    origen:string
    destino:string
    fecha:Date
    estado: string
    descripcion:string
    // usuario_id','activo_id','ubicacion_id'
}