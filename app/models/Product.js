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

// Productos de muestra para pruebas
export const sampleProducts = [
  {
    nombre: 'Ensalada César',
    descripcion: 'Ensalada fresca con lechuga romana, crutones, parmesano y aderezo César',
    precio: 15000,
    imagen: '/images/ensalada-cesar.jpg',
    destacado: true,
    categoria: 'Ensaladas',
    stock: 20
  },
  {
    nombre: 'Pollo a la Plancha',
    descripcion: 'Pechuga de pollo a la plancha con especias y hierbas aromáticas',
    precio: 25000,
    imagen: '/images/pollo-plancha.jpg',
    destacado: true,
    categoria: 'Proteínas',
    stock: 15
  },
  {
    nombre: 'Smoothie Verde',
    descripcion: 'Smoothie saludable con espinaca, manzana, plátano y jengibre',
    precio: 12000,
    imagen: '/images/smoothie-verde.jpg',
    destacado: false,
    categoria: 'Bebidas',
    stock: 30
  },
  {
    nombre: 'Quinoa Bowl',
    descripcion: 'Bowl de quinoa con vegetales frescos y aderezo de limón',
    precio: 18000,
    imagen: '/images/quinoa-bowl.jpg',
    destacado: true,
    categoria: 'Bowl',
    stock: 12
  },
  {
    nombre: 'Salmón al Horno',
    descripcion: 'Filete de salmón al horno con hierbas y limón',
    precio: 35000,
    imagen: '/images/salmon-horno.jpg',
    destacado: false,
    categoria: 'Proteínas',
    stock: 8
  }
]; 