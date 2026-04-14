import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiInfo, 
  FiClock, 
  FiShield, 
  FiAward,
  FiDroplet,
  FiSun,
  FiWind,
  FiThermometer,
  FiTool,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiShare2,
  FiHeart,
  FiBookmark
} from 'react-icons/fi';

const GuiaCuidados = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState('bolsas');
  const [abaAtiva, setAbaAtiva] = useState('cuidados');

  const categorias = [
    { id: 'bolsas', nome: 'Bolsas', icone: '👜', cor: '#d4af37' },
    { id: 'relogios', nome: 'Relógios', icone: '⌚', cor: '#9b8b7a' },
    { id: 'joias', nome: 'Joias', icone: '💎', cor: '#b76e79' },
    { id: 'vestuario', nome: 'Vestuário', icone: '👗', cor: '#7a9b7a' },
    { id: 'calcados', nome: 'Calçados', icone: '👠', cor: '#8b6b4b' },
    { id: 'acessorios', nome: 'Acessórios', icone: '👓', cor: '#6b5b7a' }
  ];

  const guias = {
    bolsas: {
      cuidados: [
        { icone: <FiDroplet />, titulo: "Limpeza Diária", descricao: "Use flanela macia e seca para remover poeira. Evite produtos químicos comuns." },
        { icone: <FiWind />, titulo: "Hidratação", descricao: "A cada 3 meses, use creme hidratante específico para couro. Aplique com movimentos circulares." },
        { icone: <FiSun />, titulo: "Armazenamento", descricao: "Mantenha dentro da dust bag original. Recheie com papel seda e evite luz solar." },
        { icone: <FiThermometer />, titulo: "Temperatura", descricao: "Evite mudanças bruscas de temperatura. Não guarde em locais úmidos." }
      ],
      naoFazer: [
        "Usar álcool ou removedores",
        "Pendurar pelo alça por longos períodos",
        "Guardar em sacos plásticos",
        "Expor ao sol por tempo prolongado"
      ],
      frequencia: [
        { periodo: "Diário", acao: "Remover poeira com flanela" },
        { periodo: "Semanal", acao: "Verificar costuras e ferragens" },
        { periodo: "Mensal", acao: "Hidratação leve" },
        { periodo: "Trimestral", acao: "Hidratação profunda" },
        { periodo: "Anual", acao: "Revisão profissional" }
      ],
      dicasExtras: [
        "Use formas para manter o formato original",
        "Alterne o uso das bolsas para descanso",
        "Guarde em locais arejados",
        "Tenha um kit de emergência sempre à mão"
      ],
      produtos: [
        { nome: "Creme Hidratante Saphir", tipo: "Couro liso", preco: "R$ 120" },
        { nome: "Escova de Camurça", tipo: "Camurça", preco: "R$ 85" },
        { nome: "Protetor Impermeabilizante", tipo: "Universal", preco: "R$ 95" },
        { nome: "Flanela de Microfibra", tipo: "Universal", preco: "R$ 25" }
      ]
    },
    relogios: {
      cuidados: [
        { icone: <FiTool />, titulo: "Manutenção Periódica", descricao: "Revisão completa a cada 3-5 anos. Troca de vedação a cada 2 anos." },
        { icone: <FiDroplet />, titulo: "Cuidados Diários", descricao: "Evite contato com perfumes e cremes. Limpe com pano de microfibra após uso." },
        { icone: <FiShield />, titulo: "Proteção", descricao: "Mantenha longe de ímãs. Evite choques e impactos fortes." },
        { icone: <FiClock />, titulo: "Armazenamento", descricao: "Use porta-relógios acolchoado. Para automáticos, use display rotativo." }
      ],
      naoFazer: [
        "Expor a mudanças bruscas de temperatura",
        "Usar em atividades esportivas (dependendo do modelo)",
        "Ajustar a hora entre 21h e 3h (mecanismos com data)",
        "Deixar próximo a celulares ou caixas de som"
      ],
      frequencia: [
        { periodo: "Diário", acao: "Limpeza com flanela" },
        { periodo: "Mensal", acao: "Verificar precisão" },
        { periodo: "Anual", acao: "Teste de vedação" },
        { periodo: "3-5 anos", acao: "Revisão completa" }
      ],
      dicasExtras: [
        "Cronografe o desempenho semanalmente",
        "Para modelos automáticos, use 8h por dia",
        "Evite ajustar a data em dias com menos de 31 dias",
        "Mantenha a garantia e documentos sempre atualizados"
      ],
      produtos: [
        { nome: "Kit de Limpeza para Relógios", tipo: "Universal", preco: "R$ 150" },
        { nome: "Porta-relógios com Rotação", tipo: "Automáticos", preco: "R$ 450" },
        { nome: "Flanela Especial", tipo: "Anti-riscos", preco: "R$ 35" },
        { nome: "Estojo de Viagem", tipo: "Rígido", preco: "R$ 120" }
      ]
    },
    joias: {
      cuidados: [
        { icone: <FiDroplet />, titulo: "Limpeza de Ouro e Prata", descricao: "Água morna com detergente neutro. Use escova de cerdas macias." },
        { icone: <FiAward />, titulo: "Pedras Preciosas", descricao: "Evite produtos químicos. Limpeza profissional a cada 6 meses." },
        { icone: <FiShield />, titulo: "Pérolas", descricao: "São porosas. Limpe com pano levemente umedecido. Use por último ao se vestir." },
        { icone: <FiTool />, titulo: "Manutenção", descricao: "Verifique engastes regularmente. Remova para dormir e praticar esportes." }
      ],
      naoFazer: [
        "Usar pasta de dente (abrasivo danifica)",
        "Expor a produtos químicos (cloro, perfume)",
        "Guardar peças juntas (arranham-se)",
        "Dormir com joias (risco de danos)"
      ],
      frequencia: [
        { periodo: "Diário", acao: "Limpeza superficial com flanela" },
        { periodo: "Mensal", acao: "Limpeza com detergente neutro" },
        { periodo: "Semestral", acao: "Revisão profissional de engastes" },
        { periodo: "Anual", acao: "Limpeza profissional completa" }
      ],
      dicasExtras: [
        "Use saquinhos individuais para guardar",
        "Remova joias ao aplicar cremes e perfumes",
        "Evite usar em piscinas ou praias",
        "Faça seguro de peças de alto valor"
      ],
      produtos: [
        { nome: "Kit de Limpeza para Joias", tipo: "Universal", preco: "R$ 80" },
        { nome: "Saquinhos de Flanela", tipo: "Individual", preco: "R$ 15" },
        { nome: "Escova de Cerdas Macias", tipo: "Profissional", preco: "R$ 25" },
        { nome: "Porta-joias com Divisórias", tipo: "Organizador", preco: "R$ 180" }
      ]
    },
    vestuario: {
      cuidados: [
        { icone: <FiWind />, titulo: "Seda", descricao: "Lavagem a seco apenas. Passe a ferro do avesso, temperatura baixa." },
        { icone: <FiDroplet />, titulo: "Cashmere", descricao: "Lave à mão com água fria e shampoo específico. Seque na horizontal." },
        { icone: <FiTool />, titulo: "Tweed", descricao: "Escove suavemente após usar. Limpeza a seco a cada 3 usos." },
        { icone: <FiThermometer />, titulo: "Alfaiataria", descricao: "Use cabides largos. Alterne uso: descanse 24h entre usos." }
      ],
      naoFazer: [
        "Torcer peças de lã ou cashmere",
        "Usar alvejante em tecidos delicados",
        "Pendurar tricôs (esticam)",
        "Secar no sol direto"
      ],
      frequencia: [
        { periodo: "Após uso", acao: "Arejar por 24h" },
        { periodo: "A cada 3 usos", acao: "Limpeza a seco (tecidos delicados)" },
        { periodo: "A cada 5 usos", acao: "Lavagem de cashmere" },
        { periodo: "A cada 10 usos", acao: "Lavagem de jeans" }
      ],
      dicasExtras: [
        "Use vaporizador para remover vincos",
        "Guarde em capas de tecido, nunca plástico",
        "Para seda: leve à lavanderia especializada",
        "Tenha um pente para remover bolinhas de cashmere"
      ],
      produtos: [
        { nome: "Shampoo para Cashmere", tipo: "The Laundress", preco: "R$ 90" },
        { nome: "Vaporizador Portátil", tipo: "Eletrônico", preco: "R$ 250" },
        { nome: "Cabides Acolchoados", tipo: "Para ternos", preco: "R$ 45" },
        { nome: "Pente para Tecidos", tipo: "Remove bolinhas", preco: "R$ 30" }
      ]
    },
    calcados: {
      cuidados: [
        { icone: <FiTool />, titulo: "Sapatos de Couro", descricao: "Use formas de madeira após uso. Impermeabilize antes do primeiro uso." },
        { icone: <FiDroplet />, titulo: "Sapatilhas", descricao: "Proteja a ponta com protetor. Evite usar em dias de chuva." },
        { icone: <FiWind />, titulo: "Tênis de Luxo", descricao: "Limpeza suave com escova e sabão neutro. Não coloque na máquina." },
        { icone: <FiShield />, titulo: "Solados", descricao: "Coloque protetor de solado. Troque palmilhas a cada 6 meses." }
      ],
      naoFazer: [
        "Usar o mesmo par dois dias seguidos",
        "Guardar sem formas (perdem formato)",
        "Secar perto de fontes de calor",
        "Usar sapatilhas em dias de chuva"
      ],
      frequencia: [
        { periodo: "Diário", acao: "Limpeza com flanela" },
        { periodo: "Semanal", acao: "Verificar solado" },
        { periodo: "Mensal", acao: "Engraxamento" },
        { periodo: "Trimestral", acao: "Revisão profissional" }
      ],
      dicasExtras: [
        "Alterne uso: 24h de descanso",
        "Use protetor de bico em sapatilhas",
        "Mantenha formas de cedro (absorvem umidade)",
        "Faça rodízio de sapatos por estação"
      ],
      produtos: [
        { nome: "Formas de Cedro", tipo: "Para sapatos", preco: "R$ 80" },
        { nome: "Kit de Engraxate", tipo: "Profissional", preco: "R$ 120" },
        { nome: "Protetor de Solado", tipo: "Adesivo", preco: "R$ 35" },
        { nome: "Escova Especial", tipo: "Para couro", preco: "R$ 45" }
      ]
    },
    acessorios: {
      cuidados: [
        { icone: <FiShield />, titulo: "Cintos", descricao: "Guarde esticados (não enrolados). Limpe com pano úmido. Hidrate o couro anualmente." },
        { icone: <FiSun />, titulo: "Óculos Escuros", descricao: "Use estojo rígido sempre. Limpe com flanela exclusiva. Evite deixar no carro." },
        { icone: <FiWind />, titulo: "Luvas", descricao: "Lave à mão com água fria. Seque longe do sol. Guarde com papel seda." },
        { icone: <FiDroplet />, titulo: "Lenços e Echarpes", descricao: "Lave a seco ou mão com shampoo. Passe do avesso. Guarde dobrados." }
      ],
      naoFazer: [
        "Guardar cintos enrolados (criam vincos)",
        "Usar papel toalha em lentes (riscam)",
        "Expor luvas de couro ao sol",
        "Pendurar lenços (esticam)"
      ],
      frequencia: [
        { periodo: "Diário", acao: "Guardar corretamente" },
        { periodo: "Semanal", acao: "Limpeza superficial" },
        { periodo: "Mensal", acao: "Verificar danos" },
        { periodo: "Anual", acao: "Hidratação de couro" }
      ],
      dicasExtras: [
        "Para cintos: use cabides próprios",
        "Óculos: tenha um kit de limpeza sempre",
        "Luvas: use talco para guardar",
        "Lenços: alterne as dobras para não marcar"
      ],
      produtos: [
        { nome: "Kit de Limpeza para Óculos", tipo: "Com flanela", preco: "R$ 45" },
        { nome: "Hidratante para Couro", tipo: "Para cintos", preco: "R$ 60" },
        { nome: "Cabides para Cintos", tipo: "Organizador", preco: "R$ 35" },
        { nome: "Saquinhos de TNT", tipo: "Para lenços", preco: "R$ 20" }
      ]
    }
  };

  const guiaAtivo = guias[categoriaAtiva];

  const abas = [
    { id: 'cuidados', nome: 'Cuidados Essenciais', icone: '✨' },
    { id: 'naoFazer', nome: 'O que NÃO fazer', icone: '❌' },
    { id: 'frequencia', nome: 'Frequência', icone: '📅' },
    { id: 'dicas', nome: 'Dicas Extras', icone: '💡' },
    { id: 'produtos', nome: 'Produtos', icone: '🛍️' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="guia-cuidados-page"
    >
      <div className="guia-header">
        <div className="container">
          <motion.h1 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            LUXE CARE GUIDE
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Guia definitivo para conservação de peças de luxo
          </motion.p>
        </div>
      </div>

      <div className="container">
        {/* Categorias */}
        <div className="categorias-care">
          {categorias.map((cat, index) => (
            <motion.button
              key={cat.id}
              className={`categoria-care-btn ${categoriaAtiva === cat.id ? 'active' : ''}`}
              onClick={() => setCategoriaAtiva(cat.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              style={{ '--cor-categoria': cat.cor }}
            >
              <span className="categoria-icone">{cat.icone}</span>
              <span className="categoria-nome">{cat.nome}</span>
            </motion.button>
          ))}
        </div>

        {/* Abas */}
        <div className="abas-care">
          {abas.map((aba) => (
            <button
              key={aba.id}
              className={`aba-care-btn ${abaAtiva === aba.id ? 'active' : ''}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              <span className="aba-icone">{aba.icone}</span>
              <span className="aba-nome">{aba.nome}</span>
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={categoriaAtiva + abaAtiva}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="conteudo-care"
          >
            {/* Aba de Cuidados */}
            {abaAtiva === 'cuidados' && (
              <div className="cuidados-grid">
                {guiaAtivo.cuidados.map((item, index) => (
                  <motion.div
                    key={index}
                    className="cuidado-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="cuidado-icone">{item.icone}</div>
                    <h3>{item.titulo}</h3>
                    <p>{item.descricao}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Aba de O que NÃO fazer */}
            {abaAtiva === 'naoFazer' && (
              <div className="nao-fazer-container">
                <h2 className="section-subtitle">
                  <FiXCircle style={{ color: '#ff4444' }} /> Erros Comuns
                </h2>
                <div className="nao-fazer-grid">
                  {guiaAtivo.naoFazer.map((item, index) => (
                    <motion.div
                      key={index}
                      className="nao-fazer-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="nao-fazer-icon">❌</span>
                      <p>{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Aba de Frequência */}
            {abaAtiva === 'frequencia' && (
              <div className="frequencia-container">
                <h2 className="section-subtitle">
                  <FiCalendar /> Calendário de Manutenção
                </h2>
                <div className="frequencia-timeline">
                  {guiaAtivo.frequencia.map((item, index) => (
                    <motion.div
                      key={index}
                      className="frequencia-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="frequencia-periodo">{item.periodo}</div>
                      <div className="frequencia-acao">{item.acao}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Aba de Dicas Extras */}
            {abaAtiva === 'dicas' && (
              <div className="dicas-container">
                <h2 className="section-subtitle">
                  <FiCheckCircle style={{ color: '#d4af37' }} /> Dicas de Especialistas
                </h2>
                <div className="dicas-grid">
                  {guiaAtivo.dicasExtras.map((dica, index) => (
                    <motion.div
                      key={index}
                      className="dica-card"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="dica-icone">✨</div>
                      <p>{dica}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Aba de Produtos */}
            {abaAtiva === 'produtos' && (
              <div className="produtos-container">
                <h2 className="section-subtitle">
                  <FiBookmark /> Produtos Recomendados
                </h2>
                <div className="produtos-grid">
                  {guiaAtivo.produtos.map((produto, index) => (
                    <motion.div
                      key={index}
                      className="produto-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h4>{produto.nome}</h4>
                      <p className="produto-tipo">{produto.tipo}</p>
                      <p className="produto-preco">{produto.preco}</p>
                      <button className="btn-comprar-produto">
                        Comprar
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Ações do Guia */}
        <div className="guia-acoes">
          <button className="btn-guia">
            <FiDownload /> Baixar PDF
          </button>
          <button className="btn-guia">
            <FiShare2 /> Compartilhar
          </button>
          <button className="btn-guia">
            <FiHeart /> Salvar
          </button>
        </div>

        {/* Newsletter */}
        <div className="guia-newsletter">
          <h3>Receba dicas exclusivas</h3>
          <p>Inscreva-se para receber nosso guia completo e novidades</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Seu melhor email" />
            <button type="submit">Inscrever-se</button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default GuiaCuidados;