<template>
  <ul class="pagination" :style="ulStyles">
    <li class="pagination-item" :style="liStyles">
        <button type="button" @click="onClickFirstPage" :disabled="isInFirstPage" :style="bStyles">
          <i class="fas fa-chevron-double-left"></i>
        </button>
    </li>
    <li class="pagination-item" :style="liStyles">
        <button type="button" @click="onClickPrevPage" :disabled="isInFirstPage" :style="bStyles">
          <i class="fas fa-chevron-left"></i>
        </button>
    </li>

    <li class="pagination-item" :style="liStyles">
        <button 
            type="button" 
            :style="bStyles"
        >
            {{ this.currentPage }}
        </button>
    </li>

    <span>
      &nbsp;of {{totalPages}}&nbsp;
    </span>

    <li class="pagination-item" :style="liStyles">
        <button type="button" @click="onClickNextPage" :disabled="isInLastPage" :style="bStyles">
         <i class="fas fa-chevron-right"></i>
         </button>
    </li>
    <li class="pagination-item" :style="liStyles">
        <button type="button" @click="onClickLastPage" :disabled="isInLastPage" :style="bStyles">
          <i class="fas fa-chevron-double-right"></i>
        </button>
    </li>
  </ul>
</template>

<script>

const defaultStyles = {
  ul: {
      margin: 0,
      padding: 0,
      display: 'inline',
      listStyle: 'none',
  },
  li: {
      listStyle: 'none',
      display: 'inline',
      textAlign: 'center',
  },
  button: {
      cursor: 'pointer',
      padding: '6px 12px',
      display: 'block',
      float: 'left',
  },
};

const defaultLabels = {
  first: 'First',
  last: 'Last',
  previous: 'Previous',
  next: 'Next',
};

export default {
  props: {
    dataSource: {
      type: Array,
      required: false,
    },
    initialPage: {
      type: Number,
      default: 1,
    },
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 1,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    styles: {
      type: Object,
      required: false,
    },
    disableDefaultStyles: {
      type: Boolean,
      default: false,
    },
    labels: {
      type: Object,
      default: () => defaultLabels,
    },
  },
  data() {
    return {
      ulStyles: {},
      liStyles: {},
      bStyles: {},
    };
  },
  created() {
    // set default styles unless disabled
    if (!this.disableDefaultStyles) {
        this.ulStyles = defaultStyles.ul;
        this.liStyles = defaultStyles.li;
        this.bStyles = defaultStyles.b;
    }

    // merge custom styles with default styles
    if (this.styles) {
        this.ulStyles = { ...this.ulStyles, ...this.styles.ul };
        this.liStyles = { ...this.liStyles, ...this.styles.li };
        this.bStyles = { ...this.bStyles, ...this.styles.button };
    }

    // set page if items array isn't empty
    if (this.dataSource && this.dataSource.length) {
        this.setPage(this.initialPage);
    }
  },
  computed: {
    startPage() {
      // When on the first page
      if (this.currentPage === 1) {
        return 1;
      }

      // When on the last page
      if (this.currentPage === this.totalPages) {
        const start = this.totalPages - (this.maxVisibleButtons - 1);
        return start === 0 ? 1 : start;
      }

      // When inbetween
      return this.currentPage - 1;
    },
    pages() {
      const range = [];

      for (
        let i = this.startPage;
        i <= Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
        i++
      ) {
        range.push({
          index: i,
          isDisabled: i === this.currentPage,
        });
      }
      return range;
    },
    isInFirstPage() {
        return this.currentPage === 1;
    },
    isInLastPage() {
        return this.currentPage === this.totalPages;
    },
  },
  methods: {
    setPage(page) {
      const pageOfItems = this.dataSource.slice((page - 1) * this.perPage, (page - 1) * this.perPage + this.perPage);
      // emit change page event to parent component
      this.$emit('pageChanged', page, pageOfItems);
    },
    onClickFirstPage() {
      this.setPage(1);
    },
    onClickPrevPage() {
      this.setPage(this.currentPage - 1);
    },
    onClickPage(page) {
      this.setPage(page);
    },
    onClickNextPage() {
      this.setPage(this.currentPage + 1);
    },
    onClickLastPage() {
      this.setPage(this.totalPages);
    },
    isPageActive(page) {
        return this.currentPage === page;
    },
  },
};
</script>
<style>

.active {
    /* background-color: #4AAE9B; */
    /* color: #ffffff; */
}
</style>
