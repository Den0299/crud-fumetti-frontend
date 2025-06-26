const API_BASE_URL = "http://localhost:8080/api";

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return (await response.text()) as unknown as T;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Abbonamento endpoints
  static async getAllAbbonamenti() {
    return this.request("/abbonamenti/get-all");
  }

  static async createAbbonamento(data: any) {
    return this.request("/abbonamenti/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateAbbonamento(id: number, data: any) {
    return this.request(`/abbonamenti/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteAbbonamento(id: number) {
    return this.request(`/abbonamenti/delete/${id}`, {
      method: "DELETE",
    });
  }

  // Asta endpoints
  static async getAllAste() {
    return this.request("/aste/get-all");
  }

  static async createAsta(data: any) {
    return this.request("/aste/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateAsta(id: number, data: any) {
    return this.request(`/aste/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteAsta(id: number) {
    return this.request(`/aste/delete/${id}`, {
      method: "DELETE",
    });
  }

  // CopiaFumetto endpoints
  static async getAllCopieFumetto() {
    return this.request("/copieFumetto/get-all");
  }

  static async createCopiaFumetto(data: any) {
    return this.request("/copieFumetto/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateCopiaFumetto(id: number, data: any) {
    return this.request(`/copieFumetto/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteCopiaFumetto(id: number) {
    return this.request(`/copieFumetto/delete/${id}`, {
      method: "DELETE",
    });
  }

  // DettagliOrdine endpoints
  static async getAllDettagliOrdini() {
    return this.request("/dettagliOrdini/get-all");
  }

  static async createDettagliOrdine(data: any) {
    return this.request("/dettagliOrdini/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateDettagliOrdine(id: number, data: any) {
    return this.request(`/dettagliOrdini/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteDettagliOrdine(id: number) {
    return this.request(`/dettagliOrdini/delete/${id}`, {
      method: "DELETE",
    });
  }

  // Fumetto endpoints
  static async getAllFumetti() {
    return this.request("/fumetti/get-fumetti");
  }

  static async createFumetto(data: any) {
    return this.request("/fumetti/create-fumetto", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateFumetto(id: number, data: any) {
    return this.request(`/fumetti/update-fumetto/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteFumetto(id: number) {
    return this.request(`/fumetti/delete-fumetto/${id}`, {
      method: "DELETE",
    });
  }

  // Ordine endpoints
  static async getAllOrdini() {
    return this.request("/ordini/get-ordini");
  }

  static async createOrdine(data: any) {
    return this.request("/ordini/create-ordine", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateOrdine(id: number, data: any) {
    return this.request(`/ordini/update-ordine/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteOrdine(id: number) {
    return this.request(`/ordini/delete-ordine/${id}`, {
      method: "DELETE",
    });
  }

  // Utente endpoints
  static async getAllUtenti() {
    return this.request("/utenti/get-utenti");
  }

  static async createUtente(data: any) {
    return this.request("/utenti/create-utente", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateUtente(id: number, data: any) {
    return this.request(`/utenti/update-utente/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteUtente(id: number) {
    return this.request(`/utenti/delete-utente/${id}`, {
      method: "DELETE",
    });
  }

  // Wishlist endpoints
  static async getAllWishlists() {
    return this.request("/wishlists/get-wishlists");
  }

  static async createWishlist(data: any) {
    return this.request("/wishlists/create-wishlist", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateWishlist(id: number, data: any) {
    return this.request(`/wishlists/update-wishlist/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteWishlist(id: number) {
    return this.request(`/wishlists/delete-wishlist/${id}`, {
      method: "DELETE",
    });
  }
}
