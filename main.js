Vue.component("detail", {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
    <div>
      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>
    </div>
  `,
});

Vue.component("product-review", {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">

      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ errors }}</li>
        </ul>
      </p>

      <label for="name">Name:</label>
      <input type="text" id="name" name="name" v-model="name" class="input">

      <label for="review">Review:</label>
      <textarea id="review" name="review" v-model="review"></textarea>

      <label for="rating">Rating:</label>
      <select id="rating" name="rating" v-model.number="rating">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>

      <h3>Would you like to recommend this product?</h3>
      <div>
        <input type="radio" id="yes" name="recommend" value="yes" v-model="recommend">
        <label for="yes">Yes</label>  
        <input type="radio" id="no" name="recommend" value="no" v-model="recommend">
        <label for="no">No</label>
      </div>
      
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        };

        this.$emit("review-submitted", productReview);

        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;

      } else {
        if (!this.name) this.errors.push("Name required!");
        if (!this.review) this.errors.push("Review required!");
        if (!this.rating) this.errors.push("Rating required!");
        if (!this.recommend) this.errors.push("Recommandation required!");
      }
    },
  },
});

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
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

        </div>
      </div>

      <product-tabs :reviews="reviews"></product-tabs>

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
      reviews: [],
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
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
    shippingCost() {
      if (this.premium) {
        return "Free";
      } else {
        return "2.99€";
      }
    },
  },
});

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true,
    }
  },
  template: `
    <div class="review">
      <span class="tab"
            :class="{ activeTab: selectedTab === tab}"
            v-for="(tab, index) in tabs"
            :key="index"
            @click="selectedTab = tab">
        {{ tab }}
      </span>

      <div v-show="selectedTab === 'Reviews'">
        <h2>Review</h2>
        <p v-if="!reviews.length">There are no reviews yet</p>
        <ul v-else>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>{{ review.review }}</p>
            <p>{{ review.rating }}</p>
            <p v-if="review.recommend">Recommended!</p>
          </li>
        </ul>
      </div>
      <product-review v-show="selectedTab === 'Make a review'" @review-submitted="addReview"></product-review>

    </div>
    `,
  data(){
    return {
      tabs: ['Reviews', 'Make a review'],
      selectedTab: 'Reviews',
    }
  },
  methods: {
    addReview(productReview) {
      this.reviews.push(productReview);
    },
  }
});

const app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateAddCart(id) {
      this.cart.push(id);
    },
    updateRemoveCart(id) {
      this.cart.splice(this.cart.indexOf(id), 1);
    },
  },
});
