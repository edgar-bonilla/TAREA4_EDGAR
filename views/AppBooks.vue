<template>
  <div class="container py-4">
    <br><br><br>
    <h1 class="title mb-4">Books</h1>

    <div v-if="showTab === 'table'">
      <div class="d-flex justify-content-end">
        <button class="btn btn-success mb-4" @click="showCreateForm">Create Book</button>
      </div>

      <table v-if="books.length > 0 && authors.length > 0" class="table table-bordered table-hover" style="width: 100%;">
        <thead class="table-dark">
          <tr>
            <th class="text-danger">ID</th>
            <th>Title</th>
            <th>Edition</th>
            <th>Copyright</th>
            <th>Language</th>
            <th>Pages</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book._id">
            <td>{{ book._id }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.edition }}</td>
            <td>{{ book.copyright }}</td>
            <td>{{ book.language }}</td>
            <td>{{ book.pages }}</td>
            <td>{{ getAuthorName(book.author_id) }}</td>
            <td>{{ getPublisherName(book.publisher_id) }}</td>

            <td class="action-buttons d-flex">
              <button class="btn btn-warning btn-sm me-2" @click="editBook(book)">Edit</button>
              <button class="btn btn-danger btn-sm" @click="deleteBook(book)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showTab === 'create'">
      <div class="container py-4 d-flex justify-content-center">
        <div class="card" style="width: 50rem;">
          <div class="card-body">
            <h1 class="title mb-4">Create Book</h1>
            <form @submit.prevent="createBook">
              <div v-for="(value, key) in newBook" :key="key" class="mb-3 row">
                <label :for="key" class="col-sm-2 col-form-label">{{ key }}</label>
                <div class="col-sm-7">
                  <input v-if="key !== 'author' && key !== 'publisher'" v-model="newBook[key]" :id="key" class="form-control" :placeholder="'Enter ' + key" required />
                  <select v-if="key === 'author_id'" v-model="newBook[key]" :id="key" class="form-select" required>
                    <option v-for="author in authors" :key="author._id" :value="author._id">{{ author.name }}</option>
                  </select>
                  <select v-if="key === 'publisher_id'" v-model="newBook[key]" :id="key" class="form-select" required>
                    <option v-for="publisher in publishers" :key="publisher._id" :value="publisher._id">{{ publisher.name }}</option>
                  </select>
                </div>
              </div>
              <div class="d-flex">
                <button type="submit" class="btn btn-primary me-2">Create</button>
                <button type="button" class="btn btn-secondary" @click="cancelCreate">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      books: [],
      authors: [],
      publishers: [],
      authorsMap: {},
      newBook: {
        title: '',
        edition: '',
        copyright: '',
        language: '',
        pages: '',
        author_id: '',
        publisher_id: '',
      },
      editingBook: null,
      showTab: 'table',
    };
  },
  async mounted() {
    try {
      const booksResponse = await fetch(`${this.$url}/.netlify/functions/bookFindAll`);
      const authorsResponse = await fetch(`${this.$url}/.netlify/functions/authorFindAll`);
      const publishersResponse = await fetch(`${this.$url}/.netlify/functions/publishersAll`);

      if (booksResponse.ok) {
        this.books = await booksResponse.json();
      }

      if (authorsResponse.ok) {
        const authorsArray = await authorsResponse.json();
        this.authors = authorsArray;
        this.authorsMap = authorsArray.reduce((map, author) => {
          map[author._id] = author.name;
          return map;
        }, {});
      }

      if (publishersResponse.ok) {
        this.publishers = await publishersResponse.json();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
  methods: {
    getAuthorName(authorId) {
      if (!authorId) return 'Unknown';
      return this.authorsMap[authorId] || 'Unknown';
    },
    getPublisherName(publisherId) {
      const publisher = this.publishers.find(p => p._id === publisherId);
      return publisher ? publisher.name : 'Unknown'; 
    },
    showCreateForm() {
      this.showTab = 'create';
    },
    cancelCreate() {
      this.showTab = 'table';
    },
    async createBook() {
      const response = await fetch(`${this.$url}/.netlify/functions/bookInsert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newBook),
      });
      if (response.ok) {
        const newBook = await response.json();
        this.books.push(newBook);
        this.cancelCreate();
      }
    },
    async editBook(book) {
      this.editingBook = { ...book };
      this.showTab = 'edit';
    },
    cancelEdit() {
      this.showTab = 'table';
      this.editingBook = null;
    },
    async updateBook() {
      const { _id, ...bookData } = this.editingBook;
      const response = await fetch(`${this.$url}/.netlify/functions/bookUpdate/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      if (response.ok) {
        const updatedBook = await response.json();
        const index = this.books.findIndex(book => book._id === updatedBook._id);
        if (index !== -1) {
          this.books[index] = updatedBook;
        }
        this.cancelEdit();
      }
    },
    async deleteBook(book) {
      const response = await fetch(`${this.$url}/.netlify/functions/bookDelete/${book._id}`, { method: 'DELETE' });
      if (response.ok) {
        const index = this.books.findIndex(b => b._id === book._id);
        if (index !== -1) this.books.splice(index, 1);
      }
    },
  },
};
</script>
