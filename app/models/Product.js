// Modelo de Producto
export class Product {
  constructor({
    id = null,
    nombre = '',
    descripcion = '',
    precio = 0,
    imagen = '',
    destacado = false,
    categoria = '',
    stock = 0,
    createdAt = new Date(),
    updatedAt = new Date()
  } = {}) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.imagen = imagen;
    this.destacado = destacado;
    this.categoria = categoria;
    this.stock = stock;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Método para convertir el producto a un objeto plano para Firestore
  toFirestore() {
    return {
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      imagen: this.imagen,
      destacado: this.destacado,
      categoria: this.categoria,
      stock: this.stock,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Método para crear un producto desde un documento de Firestore
  static fromFirestore(doc) {
    const data = doc.data();
    return new Product({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    });
  }
} 