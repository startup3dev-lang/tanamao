import { Link } from 'react-router';

export function Privacy() {
  return <main className="min-h-screen bg-[#0A1628] px-4 pb-24 pt-24 text-white"><article className="mx-auto max-w-3xl space-y-5 leading-relaxed">
    <Link to="/" className="text-[#FFD100]">← Início</Link>
    <h1 className="text-3xl font-black">Política de Privacidade</h1>
    <p>O TA PRONTO usa os dados informados por clientes e prestadores para conectar pedidos de serviço, propostas e conversas. Para questões de privacidade, escreva para <a className="text-[#FFD100] underline" href="mailto:startup3dev@gmail.com">startup3dev@gmail.com</a>.</p>
    <h2 className="text-xl font-bold">Dados tratados</h2>
    <p>Ao criar uma conta, recebemos nome, e-mail e senha; a senha é armazenada como hash. Prestadores também informam telefone, experiência, preço inicial, serviços e horários. Clientes informam endereço e descrição dos pedidos. Guardamos propostas, mensagens, favoritos, andamento dos serviços e avaliações.</p>
    <h2 className="text-xl font-bold">Uso e compartilhamento</h2>
    <p>Usamos esses dados para operar a plataforma e prevenir acessos indevidos. O prestador indicado pode ver o pedido e conversar com o cliente. O endereço completo fica disponível aos participantes após a contratação. Se você usar a localização do navegador, suas coordenadas são enviadas ao serviço Nominatim/OpenStreetMap para obter a cidade.</p>
    <h2 className="text-xl font-bold">Publicidade e cookies</h2>
    <p>Se você aceitar anúncios, carregamos o Google AdSense. O Google e outros fornecedores podem usar cookies para exibir anúncios com base em visitas a este e a outros sites. Você pode controlar anúncios personalizados nas <a className="text-[#FFD100] underline" href="https://adssettings.google.com/" target="_blank" rel="noreferrer">configurações de anúncios do Google</a>. Veja também a <a className="text-[#FFD100] underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">política do Google</a>. Se recusar, não carregamos o código do AdSense neste navegador.</p>
    <button onClick={() => window.dispatchEvent(new Event('ta-pronto-manage-ads'))} className="rounded-xl border border-white/30 px-4 py-2 text-[#FFD100]">Alterar escolha de anúncios</button>
    <h2 className="text-xl font-bold">Segurança e direitos</h2>
    <p>O acesso a pedidos e conversas exige uma sessão autenticada e permissões. Mantemos registros pelo tempo necessário à operação e às obrigações aplicáveis. Para solicitar acesso, correção ou exclusão de seus dados, use o e-mail acima. Algumas informações podem precisar ser preservadas para cumprir obrigações ou resolver disputas.</p>
    <p className="text-sm text-white/50">Atualizada em setembro de 2026.</p>
  </article></main>;
}
