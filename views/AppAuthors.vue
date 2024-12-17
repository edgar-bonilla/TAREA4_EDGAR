<template>
  <div class="container py-4">
    <br><br><br>
    <h1 class="title mb-4">Authors</h1>

    <div class="d-flex justify-content-end mb-4">
      <button class="btn btn-success" @click="showCreateForm">Create Author</button>
    </div>

    <div v-if="showTab === 'table'">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th class="text-danger">ID</th>
            <th>Name</th>
            <th>Nationality</th>
            <th>Birth Year</th>
            <th>Fields</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="author in authors" :key="author._id">
            <td>{{ author._id }}</td>
            <td>{{ author.name }}</td>
            <td>{{ author.nationality }}</td>
            <td>{{ author.birth_year }}</td>
            <td>{{ author.fields ? author.fields.join(', ') : '' }}</td>
            <td class="action-buttons">
              <button class="btn btn-warning btn-sm me-2" @click="editAuthor(author)">Edit</button>
              <button class="btn btn-danger btn-sm" @click="deleteAuthor(author)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      authors: [], 
      newAuthor: { name: '', nationality: '', birth_year: null, fields: '' }, 
      editingAuthor: null, 
      showTab: 'table', 
    };
  },
  async mounted() {
    try {
      const response = await fetch(`${this.$url}/.netlify/functions/authorFindAll`);
      this.authors = await response.json();
      console.log('Authors loaded:', this.authors); // 📢 Muestra toda la lista de autores

      // Mostrar cada _id de los autores en la consola
      this.authors.forEach(author => {
        console.log('Author ID:', author._id);
      });
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  },
  methods: {
    showCreateForm() {
      this.showTab = 'create';
    },
    cancelCreate() {
      this.showTab = 'table';
    },
    async createAuthor() {
      this.newAuthor.fields = this.newAuthor.fields.split(',').map(field => field.trim());
      
      const response = await fetch('/.netlify/functions/authorsInsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.newAuthor),
      });

      const newAuthor = await response.json();
      this.authors.push(newAuthor);
      this.newAuthor = { name: '', nationality: '', birth_year: null, fields: '' };
      this.showTab = 'table';
    },
    async editAuthor(author) {
      this.editingAuthor = { ...author };
      this.showTab = 'edit';
    },
    cancelEdit() {
      this.showTab = 'table';
      this.editingAuthor = null;
    },
    async updateAuthor() {
      if (Array.isArray(this.editingAuthor.fields)) {
        this.editingAuthor.fields = this.editingAuthor.fields.join(', ');
      }

      this.editingAuthor.fields = (this.editingAuthor.fields || '').split(',').map(field => field.trim());

      const response = await fetch(`${this.$url}/.netlify/functions/authorUpdate/${this.editingAuthor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.editingAuthor),
      });

      const updatedAuthor = await response.json();
      const index = this.authors.findIndex(author => author._id === updatedAuthor._id);
      if (index !== -1) {
        this.authors[index] = updatedAuthor;
      }
      this.cancelEdit();
    },
    async deleteAuthor(author) {
      const response = await fetch(`${this.$url}/.netlify/functions/authorsDelete/${author._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        this.authors = this.authors.filter(a => a._id !== author._id);
      } else {
        console.error('Error deleting author');
      }
    },
  },
};
</script>
