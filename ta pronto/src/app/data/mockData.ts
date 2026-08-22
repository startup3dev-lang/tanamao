export const categories = [
  { id: 1, name: 'Eletricista', icon: 'eletricista', count: 47, popular: true },
  { id: 2, name: 'Encanador', icon: 'encanador', count: 32, popular: true },
  { id: 3, name: 'Pedreiro', icon: 'pedreiro', count: 28, popular: true },
  { id: 4, name: 'Pintor', icon: 'pintor', count: 35, popular: false },
  { id: 5, name: 'Diarista', icon: 'diarista', count: 61, popular: true },
  { id: 6, name: 'Ar-condicionado', icon: 'arcondicionado', count: 19, popular: false },
  { id: 7, name: 'Jardineiro', icon: 'jardineiro', count: 14, popular: false },
  { id: 8, name: 'Montador de Móveis', icon: 'montador', count: 23, popular: false },
  { id: 9, name: 'Chaveiro', icon: 'chaveiro', count: 11, popular: false },
  { id: 10, name: 'Marceneiro', icon: 'marceneiro', count: 8, popular: false },
  { id: 11, name: 'Gesseiro', icon: 'gesseiro', count: 6, popular: false },
  { id: 12, name: 'Serviços Gerais', icon: 'gerais', count: 44, popular: true },
  { id: 13, name: 'Mecânico', icon: 'gerais', count: 5, popular: true },
];

export type Professional = {
  id: number;
  name: string;
  profession: string;
  rating: number;
  reviews: number;
  distance: string;
  eta: string;
  completedJobs: number;
  price: string;
  priceRange: string;
  available: boolean;
  badge: string;
  verified: boolean;
  initials: string;
  color: string;
  discount: string | null;
  category: string;
  bio: string;
  services: string[];
  responseTime: string;
  availability: string;
};

const featuredProfessionals: Professional[] = [
  {
    id: 1,
    name: 'Marcos Oliveira',
    profession: 'Eletricista',
    rating: 4.9,
    reviews: 238,
    distance: '1.2 km',
    eta: '15 min',
    completedJobs: 1840,
    price: 'A partir de R$ 80',
    priceRange: 'R$ 80 – R$ 300',
    available: true,
    badge: 'Disponível agora',
    verified: true,
    initials: 'MO',
    color: '#1D4ED8',
    discount: null,
    category: 'Eletricista',
    bio: 'Eletricista com mais de 15 anos de experiência em instalações residenciais e comerciais. Trabalho com responsabilidade, segurança e qualidade garantida em cada serviço.',
    services: ['Instalação elétrica', 'Troca de tomadas', 'Disjuntores', 'Iluminação', 'Chuveiro elétrico', 'Quadro elétrico'],
    responseTime: '~8 min',
    availability: 'Disponível hoje',
  },
  {
    id: 2,
    name: 'Ana Paula Silva',
    profession: 'Diarista',
    rating: 5.0,
    reviews: 412,
    distance: '0.8 km',
    eta: '10 min',
    completedJobs: 2340,
    price: 'A partir de R$ 120',
    priceRange: 'R$ 120 – R$ 250',
    available: true,
    badge: 'Melhor avaliada',
    verified: true,
    initials: 'AP',
    color: '#7C3AED',
    discount: '15% OFF',
    category: 'Diarista',
    bio: 'Especializada em limpeza profunda, organização e higienização de ambientes residenciais. Produtos incluídos.',
    services: ['Limpeza geral', 'Limpeza pesada', 'Organização', 'Passar roupas', 'Limpeza pós-obra'],
    responseTime: '~5 min',
    availability: 'Disponível hoje',
  },
  {
    id: 3,
    name: 'José Ferreira',
    profession: 'Encanador',
    rating: 4.8,
    reviews: 156,
    distance: '2.1 km',
    eta: '25 min',
    completedJobs: 890,
    price: 'A partir de R$ 90',
    priceRange: 'R$ 90 – R$ 400',
    available: true,
    badge: 'Profissional verificado',
    verified: true,
    initials: 'JF',
    color: '#059669',
    discount: null,
    category: 'Encanador',
    bio: 'Encanador com certificação, especialista em reparos de vazamentos e instalações hidráulicas residenciais e comerciais.',
    services: ['Conserto de vazamentos', 'Instalação de canos', 'Desentupimento', 'Caixa d\'água', 'Aquecedor'],
    responseTime: '~12 min',
    availability: 'Disponível hoje',
  },
  {
    id: 4,
    name: 'Carlos Santos',
    profession: 'Pintor',
    rating: 4.7,
    reviews: 94,
    distance: '3.5 km',
    eta: '40 min',
    completedJobs: 567,
    price: 'A partir de R$ 70',
    priceRange: 'R$ 70 – R$ 500',
    available: false,
    badge: 'Com desconto',
    verified: false,
    initials: 'CS',
    color: '#DC2626',
    discount: '10% OFF',
    category: 'Pintor',
    bio: 'Pintor com experiência em pintura interna e externa, texturas, grafiato e acabamentos de qualidade.',
    services: ['Pintura interna', 'Pintura externa', 'Textura', 'Caulim', 'Grafiato'],
    responseTime: '~20 min',
    availability: 'Disponível amanhã',
  },
  {
    id: 5,
    name: 'Roberto Lima',
    profession: 'Montador de Móveis',
    rating: 4.9,
    reviews: 201,
    distance: '1.8 km',
    eta: '20 min',
    completedJobs: 1230,
    price: 'A partir de R$ 60',
    priceRange: 'R$ 60 – R$ 200',
    available: true,
    badge: 'Responde rápido',
    verified: true,
    initials: 'RL',
    color: '#D97706',
    discount: null,
    category: 'Montador de Móveis',
    bio: 'Montador especializado em móveis de todas as marcas: Tok&Stok, IKEA, Etna, Leroy Merlin e outros.',
    services: ['Montagem de móveis', 'Desmontagem', 'Armários', 'Camas', 'Guarda-roupas', 'Estantes'],
    responseTime: '~6 min',
    availability: 'Disponível hoje',
  },
  {
    id: 6,
    name: 'Fernanda Costa',
    profession: 'Técnica de Ar-condicionado',
    rating: 4.8,
    reviews: 87,
    distance: '4.2 km',
    eta: '45 min',
    completedJobs: 445,
    price: 'A partir de R$ 150',
    priceRange: 'R$ 150 – R$ 600',
    available: true,
    badge: 'Disponível agora',
    verified: true,
    initials: 'FC',
    color: '#0891B2',
    discount: '20% OFF',
    category: 'Ar-condicionado',
    bio: 'Técnica certificada em instalação, manutenção e higienização de ar-condicionado de todas as marcas.',
    services: ['Instalação', 'Manutenção preventiva', 'Higienização', 'Recarga de gás', 'Reparo'],
    responseTime: '~10 min',
    availability: 'Disponível hoje',
  },
];

type ProfessionTemplate = {
  category: string;
  profession: string;
  services: string[];
  basePrice: number;
  bio: string;
};

const professionTemplates: ProfessionTemplate[] = [
  { category: 'Eletricista', profession: 'Eletricista', services: ['Instalação elétrica', 'Tomadas e interruptores', 'Chuveiro elétrico', 'Quadro de energia'], basePrice: 80, bio: 'Instalações e reparos elétricos residenciais com segurança e garantia.' },
  { category: 'Encanador', profession: 'Encanador', services: ['Vazamentos', 'Desentupimento', 'Torneiras e registros', 'Instalação hidráulica'], basePrice: 90, bio: 'Reparos hidráulicos rápidos para residências e pequenos comércios.' },
  { category: 'Pedreiro', profession: 'Pedreiro', services: ['Alvenaria', 'Assentamento de piso', 'Reboco', 'Pequenas reformas'], basePrice: 140, bio: 'Reformas, alvenaria e acabamentos executados com organização e qualidade.' },
  { category: 'Pintor', profession: 'Pintor', services: ['Pintura interna', 'Pintura externa', 'Textura', 'Correção de paredes'], basePrice: 100, bio: 'Pintura residencial com preparação de superfície e acabamento profissional.' },
  { category: 'Diarista', profession: 'Diarista', services: ['Limpeza geral', 'Limpeza pesada', 'Organização', 'Limpeza pós-obra'], basePrice: 120, bio: 'Limpeza residencial cuidadosa, pontual e adaptada à necessidade do cliente.' },
  { category: 'Ar-condicionado', profession: 'Técnico de Ar-condicionado', services: ['Instalação', 'Higienização', 'Recarga de gás', 'Manutenção'], basePrice: 150, bio: 'Instalação e manutenção de aparelhos split e janela de várias marcas.' },
  { category: 'Jardineiro', profession: 'Jardineiro', services: ['Poda', 'Manutenção de jardim', 'Plantio', 'Controle de pragas'], basePrice: 90, bio: 'Cuidados completos para jardins, quintais, vasos e áreas verdes.' },
  { category: 'Montador de Móveis', profession: 'Montador de Móveis', services: ['Guarda-roupas', 'Armários', 'Camas', 'Desmontagem e montagem'], basePrice: 70, bio: 'Montagem cuidadosa de móveis residenciais de diferentes fabricantes.' },
  { category: 'Chaveiro', profession: 'Chaveiro', services: ['Abertura de portas', 'Troca de fechadura', 'Cópia de chaves', 'Atendimento emergencial'], basePrice: 60, bio: 'Atendimento rápido para abertura, troca e instalação de fechaduras.' },
  { category: 'Marceneiro', profession: 'Marceneiro', services: ['Móveis planejados', 'Reparos em madeira', 'Prateleiras', 'Ajuste de portas'], basePrice: 160, bio: 'Soluções sob medida e reparos em móveis e estruturas de madeira.' },
  { category: 'Gesseiro', profession: 'Gesseiro', services: ['Forro de gesso', 'Sancas', 'Drywall', 'Reparos'], basePrice: 130, bio: 'Instalação e manutenção de gesso e drywall com acabamento limpo.' },
  { category: 'Serviços Gerais', profession: 'Profissional de Serviços Gerais', services: ['Pequenos reparos', 'Instalações', 'Manutenção residencial', 'Marido de aluguel'], basePrice: 75, bio: 'Soluções práticas para diferentes manutenções e instalações residenciais.' },
  { category: 'Mecânico', profession: 'Mecânico', services: ['Revisão automotiva', 'Freios', 'Suspensão', 'Troca de óleo', 'Diagnóstico mecânico'], basePrice: 120, bio: 'Manutenção automotiva preventiva e corretiva com diagnóstico transparente.' },
];

const firstNames = ['Lucas', 'Juliana', 'Rafael', 'Camila', 'André', 'Patrícia', 'Diego', 'Renata', 'Bruno', 'Larissa', 'Felipe', 'Aline', 'Gustavo'];
const lastNames = ['Almeida', 'Souza', 'Rocha', 'Martins', 'Barbosa'];
const colors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706'];

const generatedProfessionals: Professional[] = professionTemplates.flatMap((template, templateIndex) => {
  const existingCount = featuredProfessionals.filter(item => item.category === template.category).length;
  return Array.from({ length: Math.max(0, 5 - existingCount) }, (_, index) => {
    const slot = existingCount + index;
    const firstName = firstNames[(templateIndex + slot) % firstNames.length];
    const lastName = lastNames[slot % lastNames.length];
    const rating = Number((4.5 + ((templateIndex + slot) % 5) * 0.1).toFixed(1));
    const distanceValue = 0.7 + ((templateIndex * 3 + slot * 7) % 40) / 10;
    const price = template.basePrice + slot * 10;

    return {
      id: 100 + templateIndex * 10 + slot,
      name: `${firstName} ${lastName}`,
      profession: template.profession,
      rating,
      reviews: 38 + templateIndex * 17 + slot * 29,
      distance: `${distanceValue.toFixed(1)} km`,
      eta: `${10 + ((templateIndex + slot) % 8) * 5} min`,
      completedJobs: 120 + templateIndex * 83 + slot * 97,
      price: `A partir de R$ ${price}`,
      priceRange: `R$ ${price} – R$ ${price + 280}`,
      available: slot !== 4,
      badge: slot === 0 ? 'Disponível agora' : slot === 1 ? 'Melhor avaliado' : 'Profissional verificado',
      verified: slot !== 3,
      initials: `${firstName[0]}${lastName[0]}`,
      color: colors[slot % colors.length],
      discount: slot === 2 ? '10% OFF' : null,
      category: template.category,
      bio: template.bio,
      services: template.services,
      responseTime: `~${5 + slot * 3} min`,
      availability: slot === 4 ? 'Disponível amanhã' : 'Disponível hoje',
    };
  });
});

export const professionals: Professional[] = [...featuredProfessionals, ...generatedProfessionals];

export const searchSuggestions = [
  'Consertar vazamento',
  'Instalar tomada',
  'Pintar parede',
  'Montar guarda-roupa',
  'Trocar resistência do chuveiro',
  'Limpar ar-condicionado',
  'Instalar portão elétrico',
  'Assentar piso',
];

export const statusSteps = [
  { id: 1, label: 'Solicitação enviada', icon: 'sent', done: true },
  { id: 2, label: 'Profissional visualizou', icon: 'viewed', done: true },
  { id: 3, label: 'Orçamento enviado', icon: 'quote', done: true },
  { id: 4, label: 'Serviço confirmado', icon: 'confirmed', done: false },
  { id: 5, label: 'Profissional a caminho', icon: 'route', done: false },
  { id: 6, label: 'Serviço em andamento', icon: 'progress', done: false },
  { id: 7, label: 'Serviço concluído', icon: 'done', done: false },
];

export const ratingTags = ['Pontual', 'Educado', 'Serviço bem feito', 'Preço justo', 'Respondeu rápido', 'Muito cuidadoso'];

export const reviews = [
  { id: 1, author: 'Juliana M.', rating: 5, text: 'Excelente profissional! Resolveu o problema rápido e com muito cuidado.', date: '3 dias atrás' },
  { id: 2, author: 'Pedro R.', rating: 5, text: 'Super recomendo! Pontual, educado e trabalho impecável.', date: '1 semana atrás' },
  { id: 3, author: 'Carla T.', rating: 4, text: 'Bom profissional, cumpriu o combinado dentro do prazo.', date: '2 semanas atrás' },
];
