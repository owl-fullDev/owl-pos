<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light" v-if="loggedIn">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">Owl</span>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link
                to="/pendingSales"
                active-class="nav-link"
                class="nav-link"
              >
                Penjualan Pending
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/salesForm"
                active-class="nav-link"
                class="nav-link"
              >
                POS
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/Employees"
                active-class="nav-link"
                class="nav-link"
              >
                Karyawan
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/StoreInventory"
                active-class="nav-link"
                class="nav-link"
              >
                Store Inventory
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                  to="/refunds"
                  active-class="nav-link"
                  class="nav-link"
              >
                Refunds
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                  to="/findSale"
                  active-class="nav-link"
                  class="nav-link"
              >
                Cari Sales
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <span
                class="nav-link dropdown-toggle"
                id="salesDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Kiriman
              </span>
              <div class="dropdown-menu" aria-labelledby="salesDropdown">
                <router-link
                  to="/shipments/ReceiveShipments"
                  class="dropdown-item"
                >
                  Terima Kiriman
                </router-link>
                <router-link
                  to="/shipments/CreateShipments"
                  class="dropdown-item"
                >
                  Buat Kiriman
                </router-link>
              </div>
            </li>
            <li class="nav-item">
              <a href="javascript:void(0)" class="nav-link" @click="logout">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
  },
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push("/login");
    },
  },
};
</script>
