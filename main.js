Vue.component("detail_OLD", {
  template: `
          <div>
              <p>{{ description }}</p>
              <ul>
              <li v-for="detail in details">{{ detail }}</li>
              </ul>
          </div>
      `,
  data() {
    return {
      details: ["cotton 80%", "Acrylic 10%", "Polyester 10%"],
    };
  },
});

Vue.component("detail", {
    props: {
        details: {
            type: Array,
            required: true,
        }
    },
    template: `
            <div>
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>
            </div>
        `,
  });

Vue.component("product", {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
    },
  template: `
    <div class="product">
        <div class="product-image">
        <a v-bind:href="link"><img v-bind:src="image" /></a>
        </div>
        <div class="product-info">
        <h1>{{ title }}</h1>

        <span v-show="onSale">On sale!</span>

        <p v-if="inStock">In stock</p>
        <p v-else :class="{'line-through': !inStock}">Out of stock</p>
        
        <p>{{ description }}</p>
        <detail :details='["Cotton 80%", "Acrylic 10%", "Polyester 10%"]'></detail>

        <div style="display: flex">
            <div
            v-for="(variant, index) in variants"
            :key="variant.variantId"
            @mouseover="updateProduct(index)"
            class="color-box"
            :style="{backgroundColor: variant.variantColor}"
            ></div>
        </div>

        <p>Available sizes:</p>
        <ul>
            <li v-for="size in sizes">{{ size }}</li>
        </ul>

        <div>{{ onSale }}</div>

        <div>Shipping: {{ shippingCost }}</div>

        <div style='display:flex; justify-content: space-evenly; align-items: flex-end;'>
            <button
            v-on:click="addToCart"
            :disabled="!inStock"
            :class="{disabledButton: !inStock}"
            >
            Add to Cart
            </button>
            <button v-on:click="removeFromCart">Remove from Cart</button>

            <div class="cart">
            <p>Cart {{ cart }}</p>
            </div>
        </div>
        </div>
    </div>
    `,

  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
      description: "Stay warm during winter!",
      selectedVariant: 0,
      link: "www.google.com",
      sizes: ["37-39", "40-42", "43-45"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "./s1.jpg",
          variantQuantity: 10,
          variantOnSale: true,
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "./s2.jpg",
          variantQuantity: 0,
          variantOnSale: false,
        },
      ],
      cart: 0,
    };
  },
  methods: {
    addToCart() {
      return this.cart++;
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    removeFromCart() {
      if (this.cart > 0) return this.cart--;
    },
  },
  computed: {
    title() {
      return `${this.brand} ${this.product}`;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    onSale() {
      if (this.variants[this.selectedVariant].variantOnSale) {
        return `${this.brand} ${this.product} is on Sale!!!`;
      }
    },
    shippingCost(){
        if (this.premium) {
            return "Free";
        } else {
            return "2.99€";
        }
    }
  },
});

const app = new Vue({
  el: "#app",
  data: {
      premium: false,
  }
});
