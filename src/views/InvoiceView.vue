<template>
  <div v-if="currentInvoiceInit" class="invoice-view container">
    <router-link class="nav-link flex" :to="{ name: 'Home' }">
      <img src="@/assets/icon-arrow-left.svg" alt="" /> Go Back
    </router-link>
    <!-- Header -->
    <div class="header flex">
      <div class="left flex">
        <span>Status</span>
        <div
          class="status-button flex"
          :class="{
            paid: currentInvoiceInit.invoicePaid,
            draft: currentInvoiceInit.invoiceDraft,
            pending: currentInvoiceInit.invoicePending,
          }"
        >
          <span v-if="currentInvoiceInit.invoicePaid">Paid</span>
          <span v-if="currentInvoiceInit.invoiceDraft">Draft</span>
          <span v-if="currentInvoiceInit.invoicePending">Pending</span>
        </div>
      </div>
      <div class="right flex">
        <button @click="toggleEditInvoice" class="dark-purple">Edit</button>
        <button @click="deleteInvoice(currentInvoiceInit.docId)" class="red">
          Delete
        </button>
        <button
          v-if="currentInvoiceInit.invoicePending"
          @click="updateStatusToPaid(currentInvoiceInit.docId)"
          class="green"
        >
          Mark as Paid
        </button>
        <button
          v-if="
            currentInvoiceInit.invoiceDraft || currentInvoiceInit.invoicePaid
          "
          @click="updateStatusPending(currentInvoiceInit.docId)"
          class="orange"
        >
          Mark a pending
        </button>
      </div>
    </div>
    <!-- Invoice Details -->
    <div class="invoice-details flex flex-column">
      <div class="top flex">
        <div class="left flex">
          <p><span>#</span>{{ currentInvoiceInit.invoiceId }}</p>
          <p>{{ currentInvoiceInit.productDescription }}</p>
        </div>
        <div class="right flex flex-column">
          <p>{{ currentInvoiceInit.billerStreetAddress }}</p>
          <p>{{ currentInvoiceInit.billerCity }}</p>
          <p>{{ currentInvoiceInit.billerZipCode }}</p>
          <p>{{ currentInvoiceInit.billerCountry }}</p>
        </div>
      </div>
      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4>Invoice Date</h4>
          <p>{{ currentInvoiceInit.invoiceDate }}</p>
          <h4>Payment Date</h4>
          <p>
            {{ currentInvoiceInit.paymentDueDate }}
          </p>
        </div>
        <div class="bill flex flex-column">
          <h4>Bill To</h4>
          <p>{{ currentInvoiceInit.clientName }}</p>
          <p>{{ currentInvoiceInit.clientStreetAddress }}</p>
          <p>{{ currentInvoiceInit.clientCity }}</p>
          <p>{{ currentInvoiceInit.clientZipCode }}</p>
          <p>{{ currentInvoiceInit.clientCountry }}</p>
        </div>
        <div class="send-to flex flex-column">
          <h4>Sent To</h4>
          <p>{{ currentInvoiceInit.clientEmail }}</p>
        </div>
      </div>
      <div class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Item Name</p>
            <p>Qty</p>
            <p>Price</p>
            <p>Total</p>
          </div>
          <div
            v-for="(item, index) in currentInvoiceInit.invoiceItemList"
            :key="index"
            class="item flex"
          >
            <p>{{ item.itemName }}</p>
            <p>{{ item.qty }}</p>
            <p>{{ item.price }}</p>
            <p>{{ item.total }}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Amount Due</p>
          <p>{{ currentInvoiceInit.invoiceTotal }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "invoiceView",
  data() {
    return {
      currentInvoiceInit: null,
    };
  },
  created() {
    this.getCurrentInvoice();
  },
  methods: {
    ...mapMutations([
      "SET_CURRENT_INVOICE",
      "TOGGLE_EDIT_INVOICE",
      "TOGGLE_INVOICE",
    ]),
    ...mapActions([
      "DELETE_INVOICE",
      "UPDATE_STATUS_TO_PENDING",
      "UPDATE_STATUS_TO_PAID",
    ]),
    getCurrentInvoice() {
      this.SET_CURRENT_INVOICE(this.$route.params.invoiceId);
      this.currentInvoiceInit = this.currentInvoice[0];
    },
    toggleEditInvoice() {
      this.TOGGLE_EDIT_INVOICE();
      this.TOGGLE_INVOICE();
    },
    async deleteInvoice(docId) {
      await this.DELETE_INVOICE(docId);
      this.$router.push({ name: "Home" });
    },
    updateStatusToPaid(docId) {
      this.UPDATE_STATUS_TO_PAID(docId);
    },
    updateStatusPending(docId) {
      this.UPDATE_STATUS_TO_PENDING(docId);
    },
  },
  computed: {
    ...mapState(["currentInvoice", "editInvoice"]),
  },
  watch: {
    editInvoice() {
      if (!this.editInvoice) {
        this.currentInvoiceInit = this.currentInvoice[0];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.invoice-view {
  .nav-link {
    margin-bottom: 32px;
    align-items: center;
    color: #fff;
    font-size: 12px;
    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }
  .header,
  .invoice-details {
    background-color: #1e2139;
    border-radius: 20px;
  }
  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;
    .left {
      align-items: center;
      span {
        color: #dfe3fa;
        margin-right: 16px;
      }
    }
    .right {
      flex: 1;
      justify-content: flex-end;
      button {
        color: #fff;
      }
    }
  }
  .invoice-details {
    padding: 48px;
    margin-top: 24px;
    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }
      .left {
        font-size: 12px;
        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }
        p:nth-child(2) {
          font-size: 16px;
        }
        span {
          color: #888eb0;
        }
      }
      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }
    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;
      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }
      p {
        font-size: 16px;
      }
      .bill,
      .payment {
        flex: 1;
      }
      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }
        p {
          font-weight: 600;
        }
      }
      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }
        p:nth-child(3) {
          margin-top: auto;
        }
        p {
          font-size: 12px;
        }
      }
      .send-to {
        flex: 2;
      }
    }
    .bottom {
      margin-top: 50px;
      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #252945;
        .heading {
          color: #dfe3fa;
          font-size: 12px;
          margin-bottom: 32px;
          p:first-child {
            flex: 3;
            text-align: left;
          }
          p {
            flex: 1;
            text-align: right;
          }
        }
        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: #fff;
          &:last-child {
            margin-bottom: 0;
          }
          p:first-child {
            flex: 3;
            text-align: left;
          }
          p {
            flex: 1;
            text-align: right;
          }
        }
      }
      .total {
        color: #fff;
        padding: 32px;
        background-color: rgba(12, 14, 22, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;
        p {
          flex: 1;
          font-size: 12px;
        }
        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}
</style>
