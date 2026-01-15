"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock data
const subscriptions = [
  {
    id: "1",
    clientName: "Maria Silva",
    plan: "Premium",
    value: 397,
    status: "active",
    nextBilling: "2026-02-15",
    method: "Cartão de Crédito",
  },
  {
    id: "2",
    clientName: "João Santos",
    plan: "Profissional",
    value: 297,
    status: "active",
    nextBilling: "2026-02-14",
    method: "PIX",
  },
  {
    id: "3",
    clientName: "Ana Costa",
    plan: "Básico",
    value: 197,
    status: "active",
    nextBilling: "2026-02-13",
    method: "Boleto",
  },
  {
    id: "4",
    clientName: "Pedro Oliveira",
    plan: "Premium",
    value: 397,
    status: "pending",
    nextBilling: "2026-01-20",
    method: "Cartão de Crédito",
  },
  {
    id: "5",
    clientName: "Carla Mendes",
    plan: "Profissional",
    value: 297,
    status: "cancelled",
    nextBilling: "-",
    method: "PIX",
  },
];

const statusConfig = {
  active: { label: "Ativa", color: "bg-green-100 text-green-700" },
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-700" },
  cancelled: { label: "Cancelada", color: "bg-red-100 text-red-700" },
};

export default function SubscriptionsPage() {
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active");
  const pendingSubscriptions = subscriptions.filter((s) => s.status === "pending");
  const totalMRR = activeSubscriptions.reduce((sum, s) => sum + s.value, 0);

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
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalMRR)}
            </div>
            <p className="text-xs text-green-600 mt-1">+15.2% vs mês passado</p>
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
            <div className="text-2xl font-bold text-gray-900">
              {activeSubscriptions.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {subscriptions.length} total
            </p>
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
            <div className="text-2xl font-bold text-yellow-600">
              {pendingSubscriptions.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Aguardando pagamento</p>
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
            <div className="text-2xl font-bold text-gray-900">13/02</div>
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(197)} - Ana Costa
            </p>
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
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                          {sub.clientName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {sub.clientName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-700">
                        {sub.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(sub.value)}/mês
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[sub.status].color}`}>
                        {statusConfig[sub.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sub.nextBilling !== "-"
                        ? new Date(sub.nextBilling).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sub.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm">
                        Gerenciar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
