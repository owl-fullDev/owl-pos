<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
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
                to="/refunds"
                active-class="nav-link"
                class="nav-link"
              >
                Refunds
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
                <router-link to="/shipments" class="dropdown-item">
                  Terima Kiriman
                </router-link>
                <router-link to="/shipments/CreateShipments" class="dropdown-item">
                  Buat Kiriman
                </router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>
