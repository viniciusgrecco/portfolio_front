import { useState, useEffect } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { Input } from "../../components/ui";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  listClientesApi,
  createClienteApi,
  updateClienteApi,
  deleteClienteApi,
  listStocksApi,
  createStockApi,
  updateStockApi,
  deleteStockApi,
  getTickerNewsApi
} from "./api/homepageApi";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { AlertDialogContent } from "../../components/ui/alert-dialog";
import { AlertDialogDescription } from "../../components/ui/alert-dialog";
import { AlertDialogFooter } from "../../components/ui/alert-dialog";
import { AlertDialogHeader } from "../../components/ui/alert-dialog";
import { AlertDialogTitle } from "../../components/ui/alert-dialog";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";

type Cliente = {
  id: number;
  nome: string;
  sobrenome: string;
  perfil: string;
  idade: number;
};

type Stock = {
  id: number;
  ticker: string;
  preco_compra: number;
  mercado: string;
};

type TickerNews = {
  status: number;
  ticker: string;
  news_count: number;
  sentiment: {
    score: number;
    label: string;
    min: number;
    max: number;
  };
  top_topics: Array<{ topic: string; count: number }>;
};

export function Homepage() {
  const [activeTab, setActiveTab] = useState<"clientes" | "stocks">("clientes");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modais
  const [showNewsModal, setShowNewsModal] = useState(false);
  
  // Edição
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  
  // Forms inline
  const [showClienteForm, setShowClienteForm] = useState(false);
  const [showStockForm, setShowStockForm] = useState(false);
  
  // Forms
  const [clienteForm, setClienteForm] = useState({
    nome: "",
    sobrenome: "",
    perfil: "moderado",
    idade: 18
  });
  
  const [stockForm, setStockForm] = useState({
    ticker: "",
    preco_compra: 0,
    mercado: "NASDAQ"
  });
  
  const [tickerNews, setTickerNews] = useState<TickerNews | null>(null);
  const [selectedTicker, setSelectedTicker] = useState("");

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === "clientes") {
        const data = await listClientesApi();
        setClientes(data);
      } else {
        const data = await listStocksApi();
        setStocks(data);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  // ============== CLIENTES ==============
  function openClienteModal(cliente?: Cliente) {
    if (cliente) {
      setEditingCliente(cliente);
      setClienteForm({
        nome: cliente.nome,
        sobrenome: cliente.sobrenome,
        perfil: cliente.perfil,
        idade: cliente.idade
      });
      setShowClienteForm(true);
    } else {
      setEditingCliente(null);
      setClienteForm({
        nome: "",
        sobrenome: "",
        perfil: "moderado",
        idade: 18
      });
    }
  }

  function toggleClienteForm() {
    setShowClienteForm(!showClienteForm);
    setEditingCliente(null);
    setClienteForm({
      nome: "",
      sobrenome: "",
      perfil: "moderado",
      idade: 18
    });
  }

  async function handleClienteSubmit() {
    if (!clienteForm.nome || !clienteForm.sobrenome) {
      toast.error("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    try {
      if (editingCliente) {
        await updateClienteApi(editingCliente.id, clienteForm);
        toast.success("Cliente atualizado!");
      } else {
        await createClienteApi(clienteForm);
        toast.success("Cliente criado!");
      }
      setShowClienteForm(false);
      setEditingCliente(null);
      setClienteForm({
        nome: "",
        sobrenome: "",
        perfil: "moderado",
        idade: 18
      });
      loadData();
    } catch (error) {
      toast.error("Erro ao salvar cliente");
    } finally {
      setLoading(false);
    }
  }

  async function handleClienteInlineSubmit() {
    await handleClienteSubmit();
  }

  // ============== STOCKS ==============
  function openStockModal(stock?: Stock) {
    if (stock) {
      setEditingStock(stock);
      setStockForm({
        ticker: stock.ticker,
        preco_compra: stock.preco_compra,
        mercado: stock.mercado
      });
      setShowStockForm(true);
    } else {
      setEditingStock(null);
      setStockForm({
        ticker: "",
        preco_compra: 0,
        mercado: "NASDAQ"
      });
    }
  }

  function toggleStockForm() {
    setShowStockForm(!showStockForm);
    setEditingStock(null);
    setStockForm({
      ticker: "",
      preco_compra: 0,
      mercado: "NASDAQ"
    });
  }

  async function handleStockSubmit() {
    if (!stockForm.ticker || stockForm.preco_compra <= 0) {
      toast.error("Preencha todos os campos corretamente!");
      return;
    }

    setLoading(true);
    try {
      if (editingStock) {
        await updateStockApi(editingStock.id, stockForm);
        toast.success("Ação atualizada!");
      } else {
        await createStockApi(stockForm);
        toast.success("Ação criada!");
      }
      setShowStockForm(false);
      setEditingStock(null);
      setStockForm({
        ticker: "",
        preco_compra: 0,
        mercado: "NASDAQ"
      });
      loadData();
    } catch (error) {
      toast.error("Erro ao salvar ação");
    } finally {
      setLoading(false);
    }
  }

  async function handleStockInlineSubmit() {
    await handleStockSubmit();
  }

  // ============== DELETE ==============
  async function handleDeleteCliente(id: number) {
    setLoading(true);
    try {
      await deleteClienteApi(id);
      toast.success("Cliente deletado!");
      loadData();
    } catch (error) {
      toast.error("Erro ao deletar cliente");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteStock(id: number) {
    setLoading(true);
    try {
      await deleteStockApi(id);
      toast.success("Ação deletada!");
      loadData();
    } catch (error) {
      toast.error("Erro ao deletar ação");
    } finally {
      setLoading(false);
    }
  }

  // ============== TICKER NEWS ==============
  async function handleViewNews(ticker: string) {
    setSelectedTicker(ticker);
    setLoading(true);
    try {
      const data = await getTickerNewsApi(ticker);
      setTickerNews(data);
      setShowNewsModal(true);
    } catch (error) {
      toast.error("Erro ao buscar notícias");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrapper>
      <Container>
        <Header>
          <HeaderTop>
            <LogoSection>
              <Title>💼 Sistema de Investimentos</Title>
              <Subtitle>Gerencie seus clientes e ações</Subtitle>
            </LogoSection>
            <RefreshButton onClick={loadData} disabled={loading}>
              <ReloadIcon className={loading ? "animate-spin" : ""} />
              Atualizar
            </RefreshButton>
          </HeaderTop>
          
          <TabContainer>
            <Tab
              active={activeTab === "clientes"}
              onClick={() => {
                setActiveTab("clientes");
                setShowClienteForm(false);
                setShowStockForm(false);
              }}
            >
              <TabIcon>👥</TabIcon>
              <TabText>Clientes</TabText>
              <TabCount>{clientes.length}</TabCount>
            </Tab>
            <Tab
              active={activeTab === "stocks"}
              onClick={() => {
                setActiveTab("stocks");
                setShowClienteForm(false);
                setShowStockForm(false);
              }}
            >
              <TabIcon>📈</TabIcon>
              <TabText>Ações</TabText>
              <TabCount>{stocks.length}</TabCount>
            </Tab>
          </TabContainer>
        </Header>

        <Content>
          <ActionBar>
            <AddButton 
              onClick={() => activeTab === "clientes" ? toggleClienteForm() : toggleStockForm()}
            >
              <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>+</span>
              {activeTab === "clientes" ? "Novo Cliente" : "Nova Ação"}
            </AddButton>
          </ActionBar>

          {/* Formulário inline para Cliente */}
          {activeTab === "clientes" && showClienteForm && (
            <InlineFormCard>
              <FormCardHeader>
                <FormCardTitle>
                  {editingCliente ? `Editar Cliente: ${editingCliente.nome} ${editingCliente.sobrenome}` : "Adicionar Novo Cliente"}
                </FormCardTitle>
                <CloseButton onClick={toggleClienteForm}>×</CloseButton>
              </FormCardHeader>
              <FormGrid>
                <FormField>
                  <FormLabel>Nome</FormLabel>
                  <StyledInput
                    value={clienteForm.nome}
                    onChange={(e) => setClienteForm({ ...clienteForm, nome: e.target.value })}
                    placeholder="Digite o nome"
                  />
                </FormField>
                <FormField>
                  <FormLabel>Sobrenome</FormLabel>
                  <StyledInput
                    value={clienteForm.sobrenome}
                    onChange={(e) => setClienteForm({ ...clienteForm, sobrenome: e.target.value })}
                    placeholder="Digite o sobrenome"
                  />
                </FormField>
                <FormField>
                  <FormLabel>Perfil de Investimento</FormLabel>
                  <StyledSelect
                    value={clienteForm.perfil}
                    onChange={(e) => setClienteForm({ ...clienteForm, perfil: e.target.value })}
                  >
                    <option value="conservador">🛡️ Conservador</option>
                    <option value="moderado">⚖️ Moderado</option>
                    <option value="agressivo">🚀 Agressivo</option>
                  </StyledSelect>
                </FormField>
                <FormField>
                  <FormLabel>Idade</FormLabel>
                  <StyledInput
                    type="number"
                    value={clienteForm.idade}
                    onChange={(e) => setClienteForm({ ...clienteForm, idade: parseInt(e.target.value) || 18 })}
                    min={18}
                  />
                </FormField>
              </FormGrid>
              <FormActions>
                <CancelButton onClick={toggleClienteForm}>Cancelar</CancelButton>
                <SaveButton onClick={handleClienteInlineSubmit} disabled={loading}>
                  {loading ? "Salvando..." : editingCliente ? "Atualizar Cliente" : "Salvar Cliente"}
                </SaveButton>
              </FormActions>
            </InlineFormCard>
          )}

          {/* Formulário inline para Stock */}
          {activeTab === "stocks" && showStockForm && (
            <InlineFormCard>
              <FormCardHeader>
                <FormCardTitle>
                  {editingStock ? `Editar Ação: ${editingStock.ticker}` : "Adicionar Nova Ação"}
                </FormCardTitle>
                <CloseButton onClick={toggleStockForm}>×</CloseButton>
              </FormCardHeader>
              <FormGrid>
                <FormField>
                  <FormLabel>Ticker</FormLabel>
                  <StyledInput
                    value={stockForm.ticker}
                    onChange={(e) => setStockForm({ ...stockForm, ticker: e.target.value.toUpperCase() })}
                    placeholder="Ex: AAPL, PETR4"
                  />
                </FormField>
                <FormField>
                  <FormLabel>Preço de Compra (R$)</FormLabel>
                  <StyledInput
                    type="number"
                    step="0.01"
                    value={stockForm.preco_compra}
                    onChange={(e) => setStockForm({ ...stockForm, preco_compra: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </FormField>
                <FormField>
                  <FormLabel>Mercado</FormLabel>
                  <StyledSelect
                    value={stockForm.mercado}
                    onChange={(e) => setStockForm({ ...stockForm, mercado: e.target.value })}
                  >
                    <option value="NASDAQ">🇺🇸 NASDAQ</option>
                    <option value="IBOV">🇧🇷 IBOV</option>
                  </StyledSelect>
                </FormField>
              </FormGrid>
              <FormActions>
                <CancelButton onClick={toggleStockForm}>Cancelar</CancelButton>
                <SaveButton onClick={handleStockInlineSubmit} disabled={loading}>
                  {loading ? "Salvando..." : editingStock ? "Atualizar Ação" : "Salvar Ação"}
                </SaveButton>
              </FormActions>
            </InlineFormCard>
          )}

          {loading && !showNewsModal ? (
            <LoadingContainer>
              <Spinner />
              <LoadingText>Carregando dados...</LoadingText>
            </LoadingContainer>
          ) : (
            <>
              {activeTab === "clientes" ? (
                <CardsGrid>
                  {clientes.map((cliente) => (
                    <ClienteCard key={cliente.id}>
                      <CardHeader>
                        <ClienteAvatar>{cliente.nome[0]}{cliente.sobrenome[0]}</ClienteAvatar>
                        <ClienteInfo>
                          <ClienteName>{cliente.nome} {cliente.sobrenome}</ClienteName>
                          <ClienteId>ID: {cliente.id}</ClienteId>
                        </ClienteInfo>
                      </CardHeader>
                      <CardBody>
                        <InfoRow>
                          <InfoLabel>Perfil:</InfoLabel>
                          <PerfilBadge perfil={cliente.perfil}>
                            {cliente.perfil === "conservador" && "🛡️"}
                            {cliente.perfil === "moderado" && "⚖️"}
                            {cliente.perfil === "agressivo" && "🚀"}
                            {" " + cliente.perfil}
                          </PerfilBadge>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>Idade:</InfoLabel>
                          <InfoValue>{cliente.idade} anos</InfoValue>
                        </InfoRow>
                      </CardBody>
                      <CardFooter>
                        <EditButton onClick={() => openClienteModal(cliente)}>
                          ✏️ Editar
                        </EditButton>
                        <DeleteButton onClick={() => handleDeleteCliente(cliente.id)}>
                          🗑️ Deletar
                        </DeleteButton>
                      </CardFooter>
                    </ClienteCard>
                  ))}
                </CardsGrid>
              ) : (
                <CardsGrid>
                  {stocks.map((stock) => (
                    <StockCard key={stock.id}>
                      <StockCardHeader>
                        <StockTicker>{stock.ticker}</StockTicker>
                        <StockMercado mercado={stock.mercado}>
                          {stock.mercado === "NASDAQ" ? "🇺🇸" : "🇧🇷"} {stock.mercado}
                        </StockMercado>
                      </StockCardHeader>
                      <StockCardBody>
                        <StockPrice>R$ {stock.preco_compra.toFixed(2)}</StockPrice>
                        <StockPriceLabel>Preço de Compra</StockPriceLabel>
                        <StockId>ID: {stock.id}</StockId>
                      </StockCardBody>
                      <StockCardFooter>
                        <NewsButton onClick={() => handleViewNews(stock.ticker)}>
                          📰 Notícias
                        </NewsButton>
                        <EditButton onClick={() => openStockModal(stock)}>
                          ✏️ Editar
                        </EditButton>
                        <DeleteButton onClick={() => handleDeleteStock(stock.id)}>
                          🗑️
                        </DeleteButton>
                      </StockCardFooter>
                    </StockCard>
                  ))}
                </CardsGrid>
              )}
            </>
          )}
        </Content>
      </Container>

      {/* Modal News */}
      <AlertDialog open={showNewsModal} onOpenChange={setShowNewsModal}>
        <WideAlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>📰 Notícias - {selectedTicker}</AlertDialogTitle>
            <AlertDialogDescription>
              {tickerNews && (
                <NewsContainer>
                  <NewsStats>
                    <StatCard>
                      <StatIcon>📊</StatIcon>
                      <StatValue>{tickerNews.news_count}</StatValue>
                      <StatLabel>Notícias</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatIcon>
                        {tickerNews.sentiment.label.includes("Bullish") ? "📈" :
                         tickerNews.sentiment.label.includes("Bearish") ? "📉" : "➡️"}
                      </StatIcon>
                      <SentimentBadge label={tickerNews.sentiment.label}>
                        {tickerNews.sentiment.label}
                      </SentimentBadge>
                      <StatLabel>Sentimento</StatLabel>
                    </StatCard>
                  </NewsStats>

                  <ScoreSection>
                    <ScoreLabel>Score de Sentimento</ScoreLabel>
                    <ScoreValue>{tickerNews.sentiment.score.toFixed(4)}</ScoreValue>
                    <ScoreRange>
                      Range: {tickerNews.sentiment.min.toFixed(2)} → {tickerNews.sentiment.max.toFixed(2)}
                    </ScoreRange>
                  </ScoreSection>
                  
                  {tickerNews.top_topics.length > 0 && (
                    <TopicsSection>
                      <TopicsTitle>🏷️ Top Tópicos</TopicsTitle>
                      <TopicsGrid>
                        {tickerNews.top_topics.map((topic, idx) => (
                          <TopicCard key={idx}>
                            <TopicName>{topic.topic}</TopicName>
                            <TopicBadge>{topic.count}</TopicBadge>
                          </TopicCard>
                        ))}
                      </TopicsGrid>
                    </TopicsSection>
                  )}
                </NewsContainer>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowNewsModal(false)}>
              Fechar
            </AlertDialogAction>
          </AlertDialogFooter>
        </WideAlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}

// ============== STYLED COMPONENTS ==============
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const LogoSection = styled.div``;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 1rem;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  background: #f3f4f6;
  padding: 0.5rem;
  border-radius: 15px;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: ${props => props.active ? 'white' : 'transparent'};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: ${props => props.active ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    background: white;
  }
`;

const TabIcon = styled.span`
  font-size: 1.5rem;
`;

const TabText = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
  color: #1f2937;
`;

const TabCount = styled.span`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
`;

const Content = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const ActionBar = styled.div`
  margin-bottom: 2rem;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  }
`;

const InlineFormCard = styled.div`
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 2px solid #93c5fd;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FormCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FormCardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #dc2626;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: rotate(90deg);
    background: #b91c1c;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormField = styled.div``;

const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const StyledInput = styled(Input)`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 10px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f4f6;
  border-top: 5px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-weight: 600;
  font-size: 1.1rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const ClienteCard = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s;
  cursor: default;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    border-color: #3b82f6;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ClienteAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const ClienteInfo = styled.div`
  flex: 1;
`;

const ClienteName = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
`;

const ClienteId = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #9ca3af;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #6b7280;
  font-size: 0.95rem;
`;

const InfoValue = styled.span`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
`;

const PerfilBadge = styled.span<{ perfil: string }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: capitalize;
  background: ${props => 
    props.perfil === "conservador" ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)" :
    props.perfil === "moderado" ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)" :
    "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)"
  };
  color: ${props => 
    props.perfil === "conservador" ? "#1e40af" :
    props.perfil === "moderado" ? "#92400e" :
    "#991b1b"
  };
`;

const CardFooter = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const EditButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
  }
`;

const StockCard = styled.div`
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6);
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }
`;

const StockCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StockTicker = styled.h3`
  margin: 0;
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StockMercado = styled.span<{ mercado: string }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  background: ${props => props.mercado === "NASDAQ" ? 
    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" :
    "linear-gradient(135deg, #10b981 0%, #059669 100%)"
  };
`;

const StockCardBody = styled.div`
  margin-bottom: 1.5rem;
`;

const StockPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  margin-bottom: 0.25rem;
`;

const StockPriceLabel = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
  margin-bottom: 0.75rem;
`;

const StockId = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StockCardFooter = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const NewsButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
`;

const WideAlertDialogContent = styled(AlertDialogContent)`
  max-width: 600px;
`;

const NewsContainer = styled.div`
  margin-top: 1rem;
`;

const NewsStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 900;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
`;

const SentimentBadge = styled.span<{ label: string }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: ${props => 
    props.label.includes("Bullish") ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)" :
    props.label.includes("Bearish") ? "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)" :
    "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
  };
  color: ${props => 
    props.label.includes("Bullish") ? "#166534" :
    props.label.includes("Bearish") ? "#991b1b" :
    "#92400e"
  };
`;

const ScoreSection = styled.div`
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ScoreLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ScoreValue = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #5b21b6;
  margin-bottom: 0.5rem;
`;

const ScoreRange = styled.div`
  font-size: 0.875rem;
  color: #7c3aed;
  font-weight: 600;
`;

const TopicsSection = styled.div``;

const TopicsTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const TopicsGrid = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const TopicCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 1rem;
  border-radius: 10px;
  border-left: 4px solid #3b82f6;
`;

const TopicName = styled.span`
  font-weight: 600;
  color: #374151;
  text-transform: capitalize;
`;

const TopicBadge = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  `;