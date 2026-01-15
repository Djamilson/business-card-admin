"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useSubscriptions } from "@/lib/hooks/useSubscriptions";

const statusConfig = {
  active: { label: "Ativa", color: "bg-green-100 text-green-700" },
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-700" },
  canceled: { label: "Cancelada", color: "bg-red-100 text-red-700" },
  past_due: { label: "Em Atraso", color: "bg-orange-100 text-orange-700" },
};

const planMap: Record<string, string> = {
  basic: "Básico",
  professional: "Profissional",
  premium: "Premium",
  enterprise: "Enterprise",
};

const planConfig: Record<string, { color: string }> = {
  basic: { color: "bg-blue-100 text-blue-700" },
  professional: { color: "bg-purple-100 text-purple-700" },
  premium: { color: "bg-gold/20 text-yellow-700" },
  enterprise: { color: "bg-green-100 text-green-700" },
};

export default function SubscriptionsPage() {
  const { subscriptions, total, loading, error, refetch, cancelSubscription } = useSubscriptions();

  const activeSubscriptions = subscriptions.filter((s) => s.status === "active");
  const pendingSubscriptions = subscriptions.filter((s) => s.status === "pending");
  const totalMRR = activeSubscriptions.reduce((sum, s) => sum + Number(s.amount), 0);

  // Get next billing subscription
  const nextBillingSubscription = subscriptions
    .filter((s) => s.status === "active" || s.status === "pending")
    .sort((a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime())[0];

  const handleCancel = async (id: string) => {
    if (confirm("Tem certeza que deseja cancelar esta assinatura?")) {
      const success = await cancelSubscription(id);
      if (success) {
        alert("Assinatura cancelada com sucesso!");
      } else {
        alert("Erro ao cancelar assinatura. Tente novamente.");
      }
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Erro ao carregar assinaturas</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assinaturas</h1>
        <p className="text-gray-500 mt-1">
          Gerencie planos e pagamentos recorrentes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              MRR Total
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-24"></div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalMRR)}
                </div>
                <p className="text-xs text-green-600 mt-1">
                  +15.2% vs mês passado
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Assinaturas Ativas
            </CardTitle>
            <CreditCard className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">
                  {activeSubscriptions.length}
                </div>
                <p className="text-xs text-gray-500 mt-1">{total} total</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendentes
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
            ) : (
              <>
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingSubscriptions.length}
                </div>
                <p className="text-xs text-gray-500 mt-1">Aguardando pagamento</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Próxima Cobrança
            </CardTitle>
            <Calendar className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
            ) : nextBillingSubscription ? (
              <>
                <div className="text-2xl font-bold text-gray-900">
                  {new Date(nextBillingSubscription.next_billing_date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(Number(nextBillingSubscription.amount))} -{" "}
                  {(nextBillingSubscription as any).clients?.name || "Cliente"}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">-</div>
                <p className="text-xs text-gray-500 mt-1">Nenhuma cobrança agendada</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Todas as Assinaturas</CardTitle>
            <Button className="bg-gold text-black hover:bg-gold/90">
              Nova Assinatura
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próx. Cobrança
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                      Carregando assinaturas...
                    </td>
                  </tr>
                ) : subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Nenhuma assinatura encontrada
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => {
                    const client = (sub as any).clients;
                    const clientName = client?.name || "Cliente";
                    return (
                      <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                              {clientName.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {clientName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              planConfig[sub.plan]?.color || planConfig.basic.color
                            }`}
                          >
                            {planMap[sub.plan] || sub.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(Number(sub.amount))}/mês
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusConfig[sub.status as keyof typeof statusConfig]?.color ||
                              statusConfig.active.color
                            }`}
                          >
                            {statusConfig[sub.status as keyof typeof statusConfig]?.label ||
                              sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sub.next_billing_date
                            ? new Date(sub.next_billing_date).toLocaleDateString("pt-BR")
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sub.payment_method_id || "Não definido"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(sub.id)}
                            disabled={sub.status === "canceled"}
                          >
                            {sub.status === "canceled" ? "Cancelada" : "Gerenciar"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
