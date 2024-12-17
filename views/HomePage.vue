<template>
  <div class="container py-5">
    <div class="text-center mb-4">
      <h1 class="display-4 text-dark">Bienvenido a nuestra Librería con RabbitMQ</h1>
      <p class="text-dark">Explora un mundo de libros, autores y editoriales con la mejor tecnología de colas de mensajes.</p>
    </div>

    <div class="row justify-content-center">
      <div class="col-lg-4 mb-4">
        <div class="card border-primary shadow-lg h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-success">Explora nuestra colección de libros</h5>
            <p class="card-text flex-grow-1">Miles de libros a tu alcance, organizados y listos para ser descubiertos. Con RabbitMQ, te garantizamos la mejor experiencia de procesamiento de mensajes.</p>
            <div class="d-flex justify-content-between">
              <a href="/books" class="btn btn-primary">Ver libros</a>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 mb-4">
        <div class="card border-secondary shadow-lg h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-warning">Conoce a nuestros autores</h5>
            <p class="card-text flex-grow-1">Descubre a los creativos detrás de nuestras historias y su legado literario. Gestiona autores de forma eficiente con RabbitMQ.</p>
            <div class="d-flex justify-content-between">
              <a href="/authors" class="btn btn-secondary">Ver autores</a>
            
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 mb-4">
        <div class="card border-success shadow-lg h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-info">Explora nuestros editores</h5>
            <p class="card-text flex-grow-1">Los editores detrás de cada obra, asegurando que solo lo mejor llegue a tus manos. La tecnología de RabbitMQ nos permite mantener todo en orden.</p>
            <div class="d-flex justify-content-between">
              <a href="/publishers" class="btn btn-success">Ver editoriales</a>
           
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>

<style scoped>
.container {
  margin-top: 40px;
}

.card-body {
  padding: 30px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.card-text {
  font-size: 1.1rem;
}

.btn {
  font-size: 1rem;
}

.card {
  border-radius: 10px;
  border-width: 2px;
}

.card-body {
  background-color: #f8f9fa;
}

.card-body p {
  color: #495057;
}

.card.border-primary {
  border-color: #007bff;
}

.card.border-secondary {
  border-color: #6c757d;
}

.card.border-success {
  border-color: #28a745;
}

.card h5, 
.card p {
  color: #495057;
}

.d-flex .btn {
  width: 48%; /* Para asegurar que los botones se ajusten a la misma línea */
}
</style>
