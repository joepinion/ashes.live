<template>
  <modal :open="open" @update:open="$emit('update:open', false)">
    <div class="sm:w-96 sm:mx-auto">
      <h2 class="phg-natural-power">Buy this Deck</h2>
      <div class="mb-4" v-if="!this.hasDeckProduct">There are no deck products available for this deck. It may be too large.</div>
      <div class="one-product" v-for="product in this.productList">
        <span v-if="!product.deck">{{ product.name }} </span>{{ product.text }}
        <button @click="addProductToCart(product)" class="btn py-1 w-full mb-4" :disabled="!product.available">
          <span v-if="product.available">${{ product.price }} - Add to Cart <i class="fas fa-cart-plus"></i></span>
          <span v-else>Currently Unavailable</span>
        </button>
      </div>
    </div>
  </modal>
</template>

<script>
import { useToast } from 'vue-toastification'
import InputButton from '../shared/InputButton.vue'
import Modal from '../shared/Modal.vue'
import Toggle from '../shared/Toggle.vue'

export default {
  name: 'BuyDeckModal',
  props: {
    deck: {
      required: true,
    },
    products: {
      required: false,
    },
    open: Boolean,
  },
  components: {
    InputButton,
    Modal,
    Toggle,
  },
  setup () {
    return { toast: useToast() }
  },
  computed: {
    cardList() {
      let cards = [];
      cards.push(this.deck.phoenixborn.name);
      for(let one_card of this.deck.cards) {
        for(let i=0; i<one_card.count; i++) {
          cards.push(one_card.name);
        }
      }
      for(let one_card of this.deck.conjurations) {
        for(let i=0; i<one_card.count; i++) {
          cards.push(one_card.name);
        }
      }
      return cards;
    },
    diceCards() {
      let cards = [];
      for(let one_die of this.deck.dice.filter(d=>d.count>0)) {
        let ref_card = this.$products.DICE_REFERENCE_CARDS[one_die.name];
        if(ref_card && !cards.includes(ref_card)) {
          cards.push(ref_card);
        }
      }
      return cards;
    },
    hasDeckProduct() {
      return this.productList.filter(p=>p.deck).length>0;
    },
    productList() {
      let products = [];
      let cards = this.cardList;
      console.log(cards);
      let has_dice_cards = false;
      let has_basic = false;
      let has_digital = false;
      let diceCards = this.diceCards;
      for(let one_product of this.$products.products) {
        if(one_product.deck) {
          if(cards.length<one_product.attributes.max) {
            if(cards.length+diceCards.length<one_product.attributes.max) {
              one_product.attributes.cards = [...cards, ...diceCards];
              if(one_product.attributes.physical) {
                if(!has_dice_cards) {
                  one_product.text = "Print-on-Demand (includes dice reference cards)";
                  products.push(one_product);
                  has_dice_cards = true;
                }
              } else if(!has_digital) {
                one_product.text = "Print-and-Play Download (includes dice reference cards)";
                products.push(one_product);
                has_digital = true;
              }
            } else {
              one_product.attributes.cards = cards;
              if(one_product.attributes.physical && !has_basic) {
                one_product.text = "Print-on-Demand (no dice reference cards)";
                has_basic = true;
                products.push(one_product);
              } else if(!has_digital) {
                one_product.text = "Print-and-Play Download (no dice reference cards)";
                has_digital = true;
                products.push(one_product);
              }

            }
          }
        } else {
          if(this.deck.dice.filter(d=>d.count>0 && one_product.name.toLowerCase().includes(d.name)).length>0) {
            one_product.text = null;
            products.push(one_product);
          }
        }
      }
      return products;
    }
  },
  methods: {
    addProductToCart(product) {
      if(!product.available) return;
      let come_back = `${location.protocol}//${location.host}${this.$router.currentRoute.value.path}`;
      if(product.deck) {
        this.$products.getLink(product.sku, {return_to: come_back, title: this.deck.title, cards: product.attributes.cards}).then(r=>{
          if(r.ok) {
            window.location.href = r.url;
          } else {
            this.toast.error(r.message);
          }
        })
      } else {
        this.$products.getLink(product.sku, {return_to: come_back,}).then(r=>{
          if(r.ok) {
            window.location.href = r.url;
          } else {
            this.toast.error(r.message);
          }
        })
      }
    },
  },
}
</script>
