import React, { useMemo, useState } from "react";

/**
 * Plano Personalizado – Configurador + Checkout (React + Tailwind)
 *
 * - Sem dependências externas além de React + Tailwind.
 * - Estilização com gradiente e sombra conforme solicitado.
 * - Cálculo automático de valores (mensal x anual com 20% OFF e setup grátis no anual).
 * - "Resumo do plano" semelhante ao exemplo e modal de checkout em 3 passos.
 * - Pronto para copiar/colar em qualquer projeto React.
 */

// —— Preços (você pode ajustar livremente) ——
const PRICES = {
  whatsapp: 150, // R$ por conta/mês
  social: 60,    // R$ por conta/mês
  user: 50,      // R$ por usuário/mês
  broadcast: 97, // R$ fixo/mês
  setup: 297,    // R$ único
};

const SHADOW = "shadow-[0_0_10px_2px_rgba(83,18,189,0.381)]"; // box-shadow custom
const GRADIENT = "bg-[linear-gradient(0deg,rgba(59,120,204,0.73)_0%,rgba(97,229,255,0.42)_100%)]"; // gradient custom

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function StepBadge({ n, active }) {
  return (
    <div
      className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 select-none ${
        active ? `${GRADIENT} text-white ${SHADOW}` : "bg-zinc-800 text-zinc-300"
      }`}
    >
      {n}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 inline-block text-zinc-300">
        {label} {required && <span className="text-rose-400">*</span>}
      </span>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl bg-zinc-900/60 border border-zinc-700/70 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-sky-400 ${SHADOW}`}
    />
  );
}

function RangeControl({ label, value, setValue, min = 0, max = 100, step = 1, badge }) {
  return (
    <div className={`p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800 ${SHADOW}`}>
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-zinc-100">{label}</div>
        {badge && (
          <span className={`${GRADIENT} ${SHADOW} text-xs text-zinc-900 font-bold px-3 py-1 rounded-full`}>{badge}</span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setValue(Math.max(min, value - step))}
          className={`h-10 w-10 rounded-xl border border-zinc-800 flex items-center justify-center text-xl ${GRADIENT} ${SHADOW}`}
          aria-label="Diminuir"
        >
          –
        </button>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="flex-1 accent-sky-400"
        />

        <button
          type="button"
          onClick={() => setValue(Math.min(max, value + step))}
          className={`h-10 w-10 rounded-xl border border-zinc-800 flex items-center justify-center text-xl ${GRADIENT} ${SHADOW}`}
          aria-label="Aumentar"
        >
          +
        </button>

        <div className="w-24 text-right text-lg font-semibold text-zinc-100">
          {value}
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label, hint }) {
  return (
    <div className={`p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800 ${SHADOW}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-zinc-100">{label}</div>
          {hint && <div className="text-xs text-zinc-400 mt-1">{hint}</div>}
        </div>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
            checked ? "bg-sky-400/80" : "bg-zinc-700"
          }`}
          aria-pressed={checked}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
              checked ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

function PriceSummary({ qWhats, qSocial, qUsers, broadcast, billing }) {
  const monthly = useMemo(() => {
    return qWhats * PRICES.whatsapp + qSocial * PRICES.social + qUsers * PRICES.user + (broadcast ? PRICES.broadcast : 0);
  }, [qWhats, qSocial, qUsers, broadcast]);

  const yearlyMonthly = monthly * 0.8; // 20% OFF
  const setup = billing === "anual" ? 0 : PRICES.setup;

  const header = (
    <div className={`rounded-2xl p-6 text-center text-zinc-900 ${GRADIENT} ${SHADOW}`}>
      <div className="text-sm">{billing === "anual" ? "Plano Anual" : "Plano Mensal"}</div>
      <div className="text-4xl font-black tracking-tight mt-1">
        {billing === "anual" ? formatBRL(yearlyMonthly) : formatBRL(monthly)}
      </div>
      <div className="text-xs mt-1">por mês</div>
      {billing === "anual" && (
        <div className="mt-3 text-xs font-semibold">20% de desconto • Setup grátis</div>
      )}
    </div>
  );

  const economy = billing === "anual" ? monthly * 12 - yearlyMonthly * 12 : 0;

  return (
    <div className="space-y-4">
      {header}
      {billing === "anual" && (
        <div className={`rounded-xl px-4 py-2 text-xs text-center border border-zinc-700 ${SHADOW}`}>
          Economia estimada no ano: <b>{formatBRL(economy)}</b>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-2">
        <div className="text-sm font-semibold text-zinc-200">Resumo do plano</div>
        <div className="text-sm text-zinc-400">WhatsApp ({qWhats}x): <span className="float-right text-zinc-200">{formatBRL(qWhats * PRICES.whatsapp)}</span></div>
        <div className="text-sm text-zinc-400">Redes Sociais ({qSocial}x): <span className="float-right text-zinc-200">{formatBRL(qSocial * PRICES.social)}</span></div>
        <div className="text-sm text-zinc-400">Usuários ({qUsers}x): <span className="float-right text-zinc-200">{formatBRL(qUsers * PRICES.user)}</span></div>
        <div className="text-sm text-zinc-400">Disparo de Mensagem: <span className="float-right text-zinc-200">{broadcast ? formatBRL(PRICES.broadcast) : "—"}</span></div>
        <div className="text-sm text-zinc-400">Setup (único): <span className="float-right text-zinc-200">{formatBRL(setup)}</span></div>
      </div>
    </div>
  );
}

// —— Modal de Checkout ——
function CheckoutModal({ open, onClose, payload }) {
  const [step, setStep] = useState(1);
  const [billing, setBilling] = useState("mensal");
  const [form1, setForm1] = useState({ nome: "", tel: "", email: "", cpf: "" });
  const [form2, setForm2] = useState({ cnpj: "", razao: "" });
  const [form3, setForm3] = useState({ cep: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "" });
  const [errors, setErrors] = useState({});

  const monthly = payload.monthly;
  const annualMonthly = monthly * 0.8;

  function validate() {
    const errs = {};
    if (step === 1) {
      if (!form1.nome) errs.nome = "Obrigatório";
      if (!form1.tel) errs.tel = "Obrigatório";
      if (!form1.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form1.email)) errs.email = "E-mail inválido";
      if (!form1.cpf) errs.cpf = "Obrigatório";
    } else if (step === 3) {
      ["cep", "numero", "bairro", "cidade", "estado"].forEach((k) => {
        if (!form3[k]) errs[k] = "Obrigatório";
      });
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (!validate()) return;
    setStep((s) => Math.min(3, s + 1));
  }

  function prev() {
    setStep((s) => Math.max(1, s - 1));
  }

  function finish() {
    if (!validate()) return;
    const data = {
      plano: {
        billing,
        qWhats: payload.qWhats,
        qSocial: payload.qSocial,
        qUsers: payload.qUsers,
        broadcast: payload.broadcast,
        mensal: monthly,
        mensalAnual: annualMonthly,
      },
      dadosPessoais: form1,
      empresa: form2,
      endereco: form3,
    };
    // Aqui você integra com seu backend. Por hora, apenas mostramos no console.
    console.log("Checkout submetido:", data);
    alert("Plano enviado! Veja os dados no console do navegador.");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Content */}
      <div className={`relative w-full max-w-2xl rounded-3xl border border-zinc-800 overflow-hidden ${SHADOW}`}>
        <div className={`px-6 py-4 ${GRADIENT}`}>
          <div className="flex items-center justify-between text-zinc-900">
            <div className="text-xl font-extrabold">Finalizar Contratação</div>
            <button onClick={onClose} className="text-zinc-900/70 hover:text-zinc-900 text-2xl leading-none">×</button>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <StepBadge n={1} active={step === 1} />
            <div className="text-xs font-semibold text-zinc-900">Dados Pessoais</div>
            <StepBadge n={2} active={step === 2} />
            <div className="text-xs font-semibold text-zinc-900">Dados da Empresa</div>
            <StepBadge n={3} active={step === 3} />
            <div className="text-xs font-semibold text-zinc-900">Endereço</div>
          </div>
        </div>

        <div className="bg-zinc-950 p-6">
          {/* Plano selecionado */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm mb-6 flex items-center justify-between">
            <div className="text-zinc-300">
              <div className="font-semibold text-zinc-200">Plano Selecionado:</div>
              <div>
                {payload.qWhats} WhatsApp, {payload.qUsers} usuários, {payload.qSocial} redes, Disparo {payload.broadcast ? "ativado" : "desativado"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-400">Total Mensal</div>
              <div className="text-xl font-extrabold text-zinc-100">{formatBRL(billing === "anual" ? annualMonthly : monthly)}</div>
            </div>
          </div>

          {/* Escolha do tipo de plano */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setBilling("mensal")}
              className={`rounded-2xl px-4 py-3 border ${billing === "mensal" ? `${GRADIENT} ${SHADOW} text-zinc-900 border-transparent` : "border-zinc-800 bg-zinc-900/40 text-zinc-200"}`}
            >
              <div className="font-bold">Mensal</div>
              <div className="text-xs opacity-80">{formatBRL(monthly)}/mês</div>
            </button>
            <button
              onClick={() => setBilling("anual")}
              className={`rounded-2xl px-4 py-3 border ${billing === "anual" ? `${GRADIENT} ${SHADOW} text-zinc-900 border-transparent` : "border-zinc-800 bg-zinc-900/40 text-zinc-200"}`}
            >
              <div className="font-bold">Anual <span className="ml-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/90 text-white">20% OFF</span></div>
              <div className="text-xs opacity-80">{formatBRL(annualMonthly)}/mês • Setup grátis</div>
            </button>
          </div>

          {/* Steps */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nome Completo" required>
                  <Input value={form1.nome} onChange={(e) => setForm1({ ...form1, nome: e.target.value })} placeholder="Seu nome" />
                  {errors.nome && <p className="text-xs text-rose-400 mt-1">{errors.nome}</p>}
                </Field>
                <Field label="Telefone" required>
                  <Input value={form1.tel} onChange={(e) => setForm1({ ...form1, tel: e.target.value })} placeholder="(11) 99999-9999" />
                  {errors.tel && <p className="text-xs text-rose-400 mt-1">{errors.tel}</p>}
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="E-mail" required>
                  <Input type="email" value={form1.email} onChange={(e) => setForm1({ ...form1, email: e.target.value })} placeholder="email@dominio.com" />
                  {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
                </Field>
                <Field label="CPF" required>
                  <Input value={form1.cpf} onChange={(e) => setForm1({ ...form1, cpf: e.target.value })} placeholder="000.000.000-00" />
                  {errors.cpf && <p className="text-xs text-rose-400 mt-1">{errors.cpf}</p>}
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="CNPJ (opcional)">
                  <Input value={form2.cnpj} onChange={(e) => setForm2({ ...form2, cnpj: e.target.value })} placeholder="00.000.000/0000-00" />
                </Field>
                <Field label="Razão Social (opcional)">
                  <Input value={form2.razao} onChange={(e) => setForm2({ ...form2, razao: e.target.value })} placeholder="Empresa LTDA" />
                </Field>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="CEP" required>
                  <Input value={form3.cep} onChange={(e) => setForm3({ ...form3, cep: e.target.value })} placeholder="00000-000" />
                  {errors.cep && <p className="text-xs text-rose-400 mt-1">{errors.cep}</p>}
                </Field>
                <Field label="Número" required>
                  <Input value={form3.numero} onChange={(e) => setForm3({ ...form3, numero: e.target.value })} placeholder="123" />
                  {errors.numero && <p className="text-xs text-rose-400 mt-1">{errors.numero}</p>}
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Complemento">
                  <Input value={form3.complemento} onChange={(e) => setForm3({ ...form3, complemento: e.target.value })} placeholder="Apto / Bloco" />
                </Field>
                <Field label="Bairro" required>
                  <Input value={form3.bairro} onChange={(e) => setForm3({ ...form3, bairro: e.target.value })} placeholder="Centro" />
                  {errors.bairro && <p className="text-xs text-rose-400 mt-1">{errors.bairro}</p>}
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Cidade" required>
                  <Input value={form3.cidade} onChange={(e) => setForm3({ ...form3, cidade: e.target.value })} placeholder="São Paulo" />
                  {errors.cidade && <p className="text-xs text-rose-400 mt-1">{errors.cidade}</p>}
                </Field>
                <Field label="Estado" required>
                  <Input value={form3.estado} onChange={(e) => setForm3({ ...form3, estado: e.target.value })} placeholder="SP" />
                  {errors.estado && <p className="text-xs text-rose-400 mt-1">{errors.estado}</p>}
                </Field>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between">
            <button onClick={onClose} className="text-sm px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800">Cancelar</button>
            <div className="flex gap-2">
              {step > 1 && (
                <button onClick={prev} className="text-sm px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800">Voltar</button>
              )}
              {step < 3 ? (
                <button onClick={next} className={`text-sm px-5 py-2.5 rounded-xl font-semibold ${GRADIENT} ${SHADOW} text-zinc-900 hover:opacity-95`}>Próximo</button>
              ) : (
                <button onClick={finish} className={`text-sm px-5 py-2.5 rounded-xl font-semibold ${GRADIENT} ${SHADOW} text-zinc-900 hover:opacity-95`}>Finalizar Contratação</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlanoPersonalizado() {
  // Quantidades
  const [qWhats, setQWhats] = useState(10);
  const [qSocial, setQSocial] = useState(15);
  const [qUsers, setQUsers] = useState(50);
  const [broadcast, setBroadcast] = useState(true);
  const [billing, setBilling] = useState("mensal"); // "mensal" | "anual"
  const [openCheckout, setOpenCheckout] = useState(false);

  const monthly = useMemo(() => {
    return qWhats * PRICES.whatsapp + qSocial * PRICES.social + qUsers * PRICES.user + (broadcast ? PRICES.broadcast : 0);
  }, [qWhats, qSocial, qUsers, broadcast]);

  const annualMonthly = monthly * 0.8; // 20% off

  const payload = { qWhats, qSocial, qUsers, broadcast, monthly };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold">Configure seu plano personalizado</h1>
          <p className="text-zinc-400 mt-2 max-w-2xl">Monte o plano perfeito para o seu time e pague apenas pelo que usar. Valores são estimativas mensais em BRL (R$).</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna de controles */}
          <div className="lg:col-span-2 space-y-5">
            <RangeControl label="Contas WhatsApp" value={qWhats} setValue={setQWhats} min={0} max={50} step={1} badge={`${qWhats} contas`} />
            <RangeControl label="Contas Redes Sociais" value={qSocial} setValue={setQSocial} min={0} max={50} step={1} badge={`${qSocial} contas`} />
            <RangeControl label="Usuários" value={qUsers} setValue={setQUsers} min={1} max={250} step={1} badge={`${qUsers} usuários`} />
            <Toggle
              checked={broadcast}
              onChange={setBroadcast}
              label="Módulo Disparo de Mensagem"
              hint={`${formatBRL(PRICES.broadcast)}/mês – envio em massa e campanhas`}
            />
          </div>

          {/* Coluna de preço/resumo */}
          <div className="space-y-5">
            <div className={`rounded-3xl p-5 border border-zinc-800 bg-zinc-950/60 ${SHADOW}`}>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setBilling("mensal")}
                  className={`rounded-2xl px-4 py-3 border ${billing === "mensal" ? `${GRADIENT} ${SHADOW} text-zinc-900 border-transparent` : "border-zinc-800 bg-zinc-900/40 text-zinc-200"}`}
                >
                  <div className="text-sm">Plano Mensal</div>
                  <div className="text-3xl font-extrabold mt-1">{formatBRL(monthly)}</div>
                  <div className="text-[11px] opacity-80 -mt-0.5">por mês</div>
                </button>
                <button
                  onClick={() => setBilling("anual")}
                  className={`rounded-2xl px-4 py-3 border ${billing === "anual" ? `${GRADIENT} ${SHADOW} text-zinc-900 border-transparent` : "border-zinc-800 bg-zinc-900/40 text-zinc-200"}`}
                >
                  <div className="text-sm flex items-center gap-2">Plano Anual <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/90 text-white">20% OFF</span></div>
                  <div className="text-3xl font-extrabold mt-1">{formatBRL(annualMonthly)}</div>
                  <div className="text-[11px] opacity-80 -mt-0.5">por mês</div>
                </button>
              </div>

              <div className="mt-4">
                <PriceSummary qWhats={qWhats} qSocial={qSocial} qUsers={qUsers} broadcast={broadcast} billing={billing} />
              </div>

              <button
                onClick={() => setOpenCheckout(true)}
                className={`mt-5 w-full rounded-2xl py-3 font-semibold ${GRADIENT} ${SHADOW} text-zinc-900 hover:opacity-95`}
              >
                Contratar Plano
              </button>
            </div>

            <div className={`rounded-2xl p-4 text-xs text-zinc-300 border border-zinc-800 bg-zinc-950/60 ${SHADOW}`}>
              <div>Valores meramente ilustrativos. Impostos podem variar conforme sua localidade.</div>
              <div className="mt-1">Suporte e onboarding inclusos em todos os planos.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Checkout */}
      <CheckoutModal
        open={openCheckout}
        onClose={() => setOpenCheckout(false)}
        payload={payload}
      />
    </div>
  );
}
