import FeaturesButton from "@/components/home/FeaturesButton";
import StepsOfWorking from "@/components/home/StepsOfWorking";
import ValuesButton from "@/components/home/ValuesButton";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { LuListChecks, LuTarget, LuRepeat, LuGift, LuArrowRight, LuShieldCheck, LuZap, LuCircleCheck, LuTrophy } from "react-icons/lu";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col">

        {/* HERO */}
        <section className="relative overflow-hidden px-6 py-40 md:py-50 lg:py-60">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center gap-8">
            {/* Badge */}
            <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-sm">
              <LuZap size={14} />
              <span>Open Source &amp; Gratuito</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl leading-[1.1]">
              Transforme suas metas em{" "}
              <span className="bg-linear-to-r from-accent via-secondary to-accent bg-clip-text text-transparent bg-size-[200%] animate-shimmer">
                conquistas reais
              </span>
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl text-lg text-text-secondary leading-relaxed">
              Cansado de aplicativos complicados que mais atrapalham do que ajudam? O CronGoal foi
              criado para ser simples, intuitivo e motivador. Gerencie suas tarefas, projetos e
              rotinas com um sistema de gamificação que transforma produtividade em recompensa.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <Link
                href="/auth?mode=register"
                className="group flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
              >
                Comece Agora
                <LuArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/auth"
                className="flex items-center gap-2 rounded-xl border border-border-card px-8 py-3.5 text-base font-semibold text-text-primary transition-all hover:border-accent/50 hover:bg-bg-card"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="px-6 py-20 md:py-28" id="features">
          <div className="mx-auto max-w-6xl">
            {/* Section heading */}
            <div className="flex flex-col items-center text-center gap-4 mb-16">
              <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
                Tudo que você precisa em um só lugar
              </h2>
              <p className="max-w-xl text-text-secondary">
                Quatro pilares integrados que trabalham juntos para manter você no controle dos seus objetivos.
              </p>
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Tasks */}
              <FeaturesButton
                icon={LuListChecks}
                color="success"
                title="Tarefas"
                description="Crie tarefas únicas ou recorrentes. Registre conclusões diárias e acompanhe seu progresso ao longo do tempo."
              />

              {/* Projects */}
              <FeaturesButton
                icon={LuTarget}
                color="accent"
                title="Projetos"
                description="Organize suas metas maiores em projetos com prazos definidos. Vincule tarefas e visualize tudo em um Kanban intuitivo."
              />

              {/* Routines */}
              <FeaturesButton
                icon={LuRepeat}
                color="secondary"
                title="Rotinas"
                description="Agrupe tarefas recorrentes em rotinas diárias. Construa hábitos sólidos com consistência e disciplina."
              />

              {/* Rewards */}
              <FeaturesButton
                icon={LuGift}
                color="warning"
                title="Recompensas"
                description="Complete tarefas, acumule pontos e resgate recompensas personalizadas. Gamificação que funciona de verdade."
              />
            </div>
          </div>

          {/* VALUES / TRUST */}
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center gap-4 mt-16">
              <h3 className="text-xl font-bold text-text-primary">
                Porque escolher o CronGoal?
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
              <ValuesButton
                icon={LuShieldCheck}
                color="success"
                title="Seguro"
                description="Autenticação robusta com JWT e Google OAuth 2.0. Seus dados sempre protegidos."
              />

              <ValuesButton
                icon={LuZap}
                color="warning"
                title="Rápido"
                description="Arquitetura desacoplada que garante performance e tempos de resposta imperceptíveis."
              />

              <ValuesButton
                icon={LuCircleCheck}
                color="accent"
                title="Intuitivo"
                description="Interface limpa e objetiva. Menos tempo configurando, mais tempo conquistando."
              />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 py-20 md:py-28 border-t border-border-card" id="how-it-works">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center text-center gap-4 mb-16">
              <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
                Como funciona?
              </h2>
              <p className="max-w-xl text-text-secondary">
                Em três passos simples você já está transformando sua produtividade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Step 1 */}
              <StepsOfWorking
                step={1}
                title="Defina suas metas"
                description="Crie tarefas, projetos e rotinas alinhados aos seus objetivos pessoais ou profissionais."
              />
              <StepsOfWorking
                step={2}
                title="Execute com consistência"
                description="Marque tarefas como concluídas, registre seu progresso diário e acumule pontos por cada conquista."
              />
              <StepsOfWorking
                step={3}
                title="Colha as recompensas"
                description="Resgate as recompensas que você mesmo definiu. Cada ponto conquistado é um passo adiante na sua jornada."
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden px-6 py-20 md:py-28 border-t border-border-card">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
              <LuTrophy size={32} className="text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Pronto para começar?
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Cadastre-se gratuitamente e comece a transformar suas metas em conquistas hoje mesmo.
              Sem cartão de crédito. Sem letras miúdas.
            </p>
            <Link
              href="/auth?mode=register"
              className="group flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 mt-2"
            >
              Criar Minha Conta
              <LuArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-border-card px-6 py-8">
          <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm font-semibold text-text-primary">CronGoal</span>
            <p className="text-xs text-text-secondary">
              &copy; {new Date().getFullYear()} CronGoal. Projeto open source.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}