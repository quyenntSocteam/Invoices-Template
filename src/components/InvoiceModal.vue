<template>
  <div
    @click="checkClick"
    ref="invoiceWrap"
    class="invoice-wrap flex flex-column"
  >
    <form @submit.prevent="submitForm" class="invoice-content">
      <Loading v-show="loading == true"/>
      <h1 v-if="editInvoice == false">New Invoice</h1>
      <h1 v-else>Edit Invoice</h1>
      <!-- Bill From -->
      <div class="bill-from flex flex-column">
        <h4>Bill From</h4>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Street Address</label>
          <input
            type="text"
            required
            id="billerStreetAddress"
            v-model="billerStreetAddress"
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">City</label>
            <input type="text" required id="billerCity" v-model="billerCity" />
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Zip code</label>
            <input
              type="text"
              required
              id="billerZipCode"
              v-model="billerZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">Country</label>
            <input
              type="text"
              required
              id="billerCountry"
              v-model="billerCountry"
            />
          </div>
        </div>
      </div>
      <!-- Bill To -->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <div class="input flex flex-column">
          <label for="clientName">Client's Name</label>
          <input type="text" required id="clientName" v-model="clientName" />
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">Client's Email</label>
          <input type="text" required id="clientEmail" v-model="clientEmail" />
        </div>
        <div class="input flex flex-column">
          <label for="clientStreetAddress">Street Address</label>
          <input
            type="text"
            required
            id="clientStreetAddress"
            v-model="clientStreetAddress"
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientCity">City</label>
          <input type="text" required id="clientCity" v-model="clientCity" />
        </div>
        <div class="input flex flex-column">
          <label for="clientZipCode">Zip code</label>
          <input
            type="text"
            required
            id="clientZipCode"
            v-model="clientZipCode"
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientCountry">Country</label>
          <input
            type="text"
            required
            id="clientCountry"
            v-model="clientCountry"
          />
        </div>
      </div>
      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Invoice Date</label>
            <input
              type="text"
              required
              id="invoiceDate"
              v-model="invoiceDate"
            />
          </div>
            <div class="input flex flex-column">
          <label for="paymentDueDate">Payment Due</label>
          <input
            type="text"
            required
            id="paymentDueDate"
            v-model="paymentDueDate"
            />
        </div>
        </div>
         <div class="input flex flex-column">
          <label for="clientName">Client's Name</label>
          <select required type="text" id="paymentTerms" v-model="paymentTerms">
                <option value="30">Net 30 Days</option>
                <option value="60">Net 60 Days</option>
          </select>
        </div>
         <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input
            type="text"
            required
            id="productDescription"
            v-model="productDescription"
          />
        </div>
        <div class="work-items">
           <h3>Item List</h3>
           <table class="item-list">
              <tr class="table-heading">
                   <th class="item-name">Item Name</th>
                   <th class="Qty">Qty</th>
                   <th class="price">Price</th>
                   <th class="total">Total</th>
              </tr>
              <tr class="table-item" v-for="(item, index) in invoiceItemList" :key="index">
                   <td class="item-name"><input type="text" v-model="item.itemName"/></td>
                   <td class="Qty"><input type="text" v-model="item.qty"/></td>
                   <td class="price"><input type="text" v-model="item.price"/></td>
                   <td class="total">${{ ( item.total = item.qty * item.price ) }}</td>
                   <img @click="deleteInvoiceItem(item.id)" src="@/assets/icon-delete.svg" alt=""/>
              </tr>
           </table>
           <div @click="addNewInvoiceItem" class="flex button">
                  <img src="@/assets/icon-plus.svg" alt=""/>
                  Add New Item
           </div>
        </div>
      </div>
      <!-- Save/Exit -->
      <div class="save flex">
         <div class="left">
            <button @click="closeInvoice" class="red">Cancel</button>
         </div>
         <div class="right flex">
            <button v-if="!editInvoice" type="submit" @click="saveDraft" class="dark-purple">Save Darft</button>
            <button  v-if="!editInvoice" type="submit" @click="publishInvoice" class="purple">Create Invoice</button>
            <button  v-if="editInvoice" type="submit" @click="publishInvoice" class="purple">Update Invoice</button>
         </div>
      </div>
    </form>
  </div>
</template>
<script>
import db from "../firebase/firebaseInit"
import Loading from "./Loading.vue"
import { mapActions, mapMutations, mapState } from "vuex"
import { uid } from 'uid'

export default {
  data() {
    return {
      dateOptions: { year: "numeric", month: "short", day: "numeric" },
      docId: null,
      loading: null,
      billerStreetAddress: null,
      billerCity: null,
      billerZipCode: null,
      billerCountry: null,
      clientName: null,
      clientEmail: null,
      clientStreetAddress: null,
      clientCity: null,
      clientZipCode: null,
      clientCountry: null,
      invoiceDateUnix: null,
      invoiceDate: null,
      paymentTerms: null,
      paymentDueDateUnix: null,
      paymentDueDate: null,
      productDescription: null,
      invoicePending: null,
      invoiceDraft: null,
      invoiceItemList: [],
      invoiceTotal: 0,
    };
  },
  components: {
     Loading
  },
  created() {
    if(!this.editInvoice) {
       this.invoiceDateUnix = Date.now()
       this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString("en-us", this.dateOptions)
    } else {
      const currentInvoice = this.currentInvoice[0]
      this.docId = currentInvoice.docId;
      this.billerStreetAddress = currentInvoice.billerStreetAddress;
      this.billerCity = currentInvoice.billerCity;
      this.billerZipCode = currentInvoice.billerZipCode;
      this.billerCountry = currentInvoice.billerCountry;
      this.clientName = currentInvoice.clientName;
      this.clientEmail = currentInvoice.clientEmail;
      this.clientStreetAddress = currentInvoice.clientStreetAddress;
      this.clientCity = currentInvoice.clientCity;
      this.clientZipCode = currentInvoice.clientZipCode;
      this.clientCountry = currentInvoice.clientCountry;
      this.invoiceDateUnix = currentInvoice.invoiceDateUnix;
      this.invoiceDate = currentInvoice.invoiceDate;
      this.paymentTerms = currentInvoice.paymentTerms;
      this.paymentDueDateUnix = currentInvoice.paymentDueDateUnix;
      this.paymentDueDate = currentInvoice.paymentDueDate;
      this.productDescription = currentInvoice.productDescription;
      this.invoicePending = currentInvoice.invoicePending;
      this.invoiceDraft = currentInvoice.invoiceDraft;
      this.invoiceItemList = currentInvoice.invoiceItemList;
      this.invoiceTotal = currentInvoice.invoiceTotal;
    }
  },
  watch: { 
    paymentTerms() {
      // Tomorrow research ? review code 1h37p minutes 
      const futureDate = new Date()
      this.paymentDueDateUnix = futureDate.setDate(futureDate.getDay() + parseInt(this.paymentTerms))
      this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleDateString("en-us", this.dateOptions)
    }
  },
  methods: { 
    ...mapMutations(['TOGGLE_INVOICE', 'TOGGLE_MODAL', 'TOGGLE_EDIT_INVOICE']),
    ...mapActions(['UPDATE_INVOICE', 'GET_INVOICES']),
    checkClick(e) {
       if(e.target == this.$refs.invoiceWrap) {
         console.log("check click", this.$refs.invoiceWrap)
         this.TOGGLE_MODAL()
       }
    },
    closeInvoice() {
      this.TOGGLE_INVOICE()
      if(this.editInvoice) {
        this.TOGGLE_EDIT_INVOICE()
      }
    },
    addNewInvoiceItem() {
      this.invoiceItemList.push({
        id: uid(),
        itemName: "",
        qty: "",
        price: 0,
        total: 0,
      })
    },
    deleteInvoiceItem(id) {
      console.log("Invoice", id)
      console.log(this.invoiceItemList)
      this.invoiceItemList = this.invoiceItemList.filter((item) => item.id !== id)
    },
    calInvoiceTotal() {
      this.invoiceTotal = 0
      this.invoiceItemList.forEach(item => {
        this.invoiceTotal += item.total
      })
    },
    publishInvoice() {
      this.invoicePending = true
    },
    saveDraft() {
      this.invoiceDraft = true
    },
    async uploadInvoice() {
      if(this.invoiceItemList.length <= 0) {
          alert("please help to check text input correct?")
          return;
      }
      this.loading = true
      this.calInvoiceTotal()
      const dataBase = db.collection('invoices').doc()

      await dataBase.set({
        invoiceId: uid(6),
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        invoiceDate: this.invoiceDate,
        invoiceDateUnix: this.invoiceDateUnix,
        paymentTerms: this.paymentTerms,
        paymentDueDate: this.paymentDueDate,
        paymentDueDateUnix: this.paymentDueDateUnix,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
        invoicePending: this.invoicePending,
        invoiceDraft: this.invoiceDraft,
        invoicePaid: null,
      })
      this.loading = false
      this.TOGGLE_INVOICE()
      this.GET_INVOICES()
    },
     async updateInvoice() {
      if(this.invoiceItemList.length <= 0) {
          alert("please help to check text input correct?")
          return;
      }
      this.loading = true
      this.calInvoiceTotal()
      const dataBase = db.collection('invoices').doc(this.docId)

      await dataBase.update({
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        invoiceDate: this.invoiceDate,
        invoiceDateUnix: this.invoiceDateUnix,
        paymentTerms: this.paymentTerms,
        paymentDueDate: this.paymentDueDate,
        paymentDueDateUnix: this.paymentDueDateUnix,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
      })
      this.loading = false
      const data = {
        docId: this.docId,
        routeId: this.$route.params.invoiceId
      }
      this.UPDATE_INVOICE(data)
    },
    submitForm() {
      if(this.editInvoice) {
        this.updateInvoice()
        return
      }
      this.uploadInvoice()
    }
  },
  computed: {
    ...mapState(['editInvoice', 'currentInvoice'])
  }
};
</script>
<style lang="scss" scoped>
    .invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }
  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    h1 {
      margin-bottom: 48px;
      color: #fff;
    }
    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }
    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }
    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;
      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    .invoice-work {
      .payment {
        gap: 24px;

         div {
           flex: 1;
         }
      }

      .work-items {
        .item-list {
           width: 100%;

            .table-heading,
            .table-item {
              gap: 16px;
              font-size: 12px;

                .item-name {
                  flex-basis: 50%;
                }

                .Qty {
                  flex-basis: 10%;
                }

                .price {
                  flex-basis: 10%;
                }

                .total {
                  flex-basis: 20%;
                  align-self: center;
                }
            }

            .table-heading {
              margin-bottom: 16px;

                th {
                  text-align: left;
                }
            }

            .table-item {
              position: relative;
              margin-bottom: 24px;

              img {
                position: absolute;
                top: 15px;
                right: 0;
                width: 12px;
                height: 16px;
              }
            }
        }

         .button {
        color: #fff;
        background-color: #252945;
        align-content: center;
        justify-content: center;
        width: 100%;
        margin-top: 30px;

         img {
            margin-left: 4px;
         }
      }
      }
    }

    .save {
      margin-top: 60px;

        div {
          flex: 1;
        }

        .right {
          justify-content: flex-end;
        }
    }

  }
  .input {
    margin-bottom: 24px;
  }
  label {
    font-size: 12px;
    margin-bottom: 6px;
  }
  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;
    &:focus {
      outline: none;
    }
  }
}
</style>
