<template>
  <h1 class="phg-side-action">Enemy Decks</h1>
  <p>Red Rains Chimera decks can now be printed on demand. Please note, the below products provide the Chimera cards only, no player cards and no Chimera board/dice/tokens.</p>

  <div v-if="products === null" class="text-center py-4">
    <p>Loading products...</p>
  </div>

  <div v-else>
    <div v-for="product in redRainsProducts" :key="product.id" class="one-product flex items-start justify-center mb-2">
      <div class="flex flex-col justify-center items-center font-bold">
        <div>{{ product.name }}</div>
        <button @click="addProductToCart(product)" class="fancy-button mb-4 font-normal" :disabled="!product.available">
          <span v-if="product.available" class="text-[#1398c3]">${{ product.price }} - Add to Cart <i class="fas fa-cart-plus"></i></span>
          <span v-else  class="text-[#8c8c8c]">Unavailable</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'
export default {
  name: 'EnemyDecks',
  setup () {
    return { toast: useToast() }
  },
  data() {
    return {
      products: null,
      productTimer: null,
    }
  },
  computed: {
    redRainsProducts() {
      if (!this.products) return [];
      return this.products.filter(product =>
        product.name && product.name.toLowerCase().includes('red rains')
      );
    }
  },
  beforeMount () {
    this.checkProducts();
  },
  methods: {
    checkProducts() {
      this.products = this.$products.products;
      if(this.products===null) {
        this.productTimer = setTimeout(()=>{
          this.checkProducts();
        }, 500);
      } else {
        console.log('products loaded', this.products);
      }
    },
    addProductToCart(product) {
      if(!product.available) return;
      let come_back = `${location.protocol}//${location.host}${this.$router.currentRoute.value.path}`;
      this.$products.getLink(product.sku, {return_to: come_back,}).then(r=>{
        if(r.ok) {
          window.location.href = r.url;
        } else {
          this.toast.error(r.message);
        }
      });
    },
  },
}
</script>
