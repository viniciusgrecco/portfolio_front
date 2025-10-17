import { config } from "../../../config/config";

// ============== CLIENTES ==============
export async function listClientesApi() {
  const response = await fetch(config.apiBaseUrl + "/clientes", {
    method: "GET",
    credentials: "include"
  });
  
  if (!response.ok) throw new Error('Erro ao listar clientes');
  return await response.json();
}

export async function getClienteApi(clienteId: number) {
  const response = await fetch(config.apiBaseUrl + `/clientes/${clienteId}`, {
    method: "GET",
    credentials: "include"
  });
  
  if (!response.ok) throw new Error('Erro ao buscar cliente');
  return await response.json();
}

export async function createClienteApi(data: {
  nome: string;
  sobrenome: string;
  perfil: string;
  idade: number;
}) {
  const response = await fetch(config.apiBaseUrl + "/clientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
  
  if (!response.ok) throw new Error('Erro ao criar cliente');
  return await response.json();
}

export async function updateClienteApi(clienteId: number, data: {
  nome?: string;
  sobrenome?: string;
  perfil?: string;
  idade?: number;
}) {
  const response = await fetch(config.apiBaseUrl + `/clientes/${clienteId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
  
  if (!response.ok) throw new Error('Erro ao atualizar cliente');
  return await response.json();
}

export async function deleteClienteApi(clienteId: number) {
  const response = await fetch(config.apiBaseUrl + `/clientes/${clienteId}`, {
    method: "DELETE",
    credentials: "include"
  });
  
  if (!response.ok) throw new Error('Erro ao deletar cliente');
  return await response.json();
}

// ============== STOCKS ==============
export async function listStocksApi() {
  const response = await fetch(config.apiBaseUrl + "/stocks", {
    method: "GET",
    credentials: "include"
  });
  
  if (!response.ok) throw new Error('Erro ao listar ações');
  return await response.json();
}

export async function getStockApi(stockId: number) {
  const response = await fetch(config.apiBaseUrl + `/stocks/${stockId}`, {
    method: "GET",
    credentials: "include"
  });
  
  if (!response.ok) throw new Error('Erro ao buscar ação');
  return await response.json();
}

export async function createStockApi(data: {
  ticker: string;
  preco_compra: number;
  mercado: string;
}) {
  const response = await fetch(config.apiBaseUrl + "/stocks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
  
  if (!response.ok) throw new Error('Erro ao criar ação');
  return await response.json();
}

export async function updateStockApi(stockId: number, data: {
  ticker?: string;
  preco_compra?: number;
  mercado?: string;
}) {
  const response = await fetch(config.apiBaseUrl + `/stocks/${stockId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
  
  if (!response.ok) throw new Error('Erro ao atualizar ação');
  return await response.json();
}

export async function deleteStockApi(stockId: number) {
  const response = await fetch(config.apiBaseUrl + `/stocks/${stockId}`, {
    method: "DELETE",
    credentials: "include"
  });
  
  if (!response.ok) throw new Error('Erro ao deletar ação');
  return await response.json();
}

// ============== TICKER NEWS ==============
export async function getTickerNewsApi(ticker: string) {
  const response = await fetch(config.apiBaseUrl + `/get/one/ticker/${ticker}`, {
    method: "GET",
    credentials: "include"
  });
  
  if (!response.ok) throw new Error('Erro ao buscar notícias do ticker');
  return await response.json();
}