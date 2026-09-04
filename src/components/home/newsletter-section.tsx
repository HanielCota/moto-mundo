"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, CheckCircle } from "lucide-react";

const newsletterSchema = z.object({
  email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

export function NewsletterSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: NewsletterForm) => {
    toast.success("Inscrição realizada com sucesso!", {
      description: `Enviaremos cupons e novidades para ${data.email}`,
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    });
    reset();
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 sm:p-10 shadow-xs text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
            <Mail className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mb-2">
            Receba alertas de peças raras e ofertas VIP
          </h2>
          <p className="text-sm text-zinc-600 max-w-lg mb-6">
            Cadastre seu e-mail para receber cupons exclusivos das lojas parceiras e avisos de reposição de estoque antes de todo mundo.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md flex flex-col gap-2"
            noValidate
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail..."
                  {...register("email")}
                  className="w-full h-11 px-4 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-6 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm tracking-wide transition-all shadow-xs active:scale-[0.98] shrink-0"
              >
                Cadastrar
              </button>
            </div>

            {errors.email && (
              <p className="text-xs text-rose-600 text-left font-medium">
                {errors.email.message}
              </p>
            )}

            <p className="text-[11px] text-zinc-400 mt-2">
              Respeitamos sua privacidade. Você pode cancelar a qualquer momento sem custos.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
