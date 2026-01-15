"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Download,
  Mail,
  Phone,
  Loader2
} from "lucide-react";
import { useClients } from "@/lib/hooks/useClients";

const statusConfig = {
  active: { label: "Ativo", color: "bg-green-100 text-green-700" },
  canceled: { label: "Cancelado", color: "bg-gray-100 text-gray-700" },
  suspended: { label: "Suspenso", color: "bg-red-100 text-red-700" },
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

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Fetch clients from Supabase
  const { clients, total, loading, error, refetch, deleteClient } = useClients({
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchTerm || undefined,
  });

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      const success = await deleteClient(id);
      if (success) {
        alert("Cliente excluído com sucesso!");
      } else {
        alert("Erro ao excluir cliente. Tente novamente.");
      }
    }
  };

  // Get plan from subscriptions
  const getClientPlan = (client: any) => {
    if (client.subscriptions && client.subscriptions.length > 0) {
      return client.subscriptions[0].plan;
    }
    return "basic";
  };

  // Get revenue from subscriptions
  const getClientRevenue = (client: any) => {
    if (client.subscriptions && client.subscriptions.length > 0) {
      const activeSubscription = client.subscriptions.find((s: any) => s.status === "active");
      return activeSubscription ? Number(activeSubscription.amount) : 0;
    }
    return 0;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Erro ao carregar clientes</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">
            Gerencie todos os seus clientes e assinaturas
          </p>
        </div>
        <Button className="flex items-center gap-2 bg-gold text-black hover:bg-gold/90">
          <Plus size={18} />
          Novo Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
            ) : (
              <div className="text-2xl font-bold text-gray-900">{total}</div>
            )}
            <p className="text-sm text-gray-500">Total de Clientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {clients.filter((c) => c.subscription_status === "active").length}
              </div>
            )}
            <p className="text-sm text-gray-500">Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
            ) : (
              <div className="text-2xl font-bold text-gray-600">
                {clients.filter((c) => c.subscription_status === "canceled").length}
              </div>
            )}
            <p className="text-sm text-gray-500">Cancelados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {clients.filter((c) => c.subscription_status === "suspended").length}
              </div>
            )}
            <p className="text-sm text-gray-500">Suspensos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
                <option value="suspended">Suspensos</option>
              </select>

              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={18} />
                Filtros
              </Button>

              <Button variant="outline" className="flex items-center gap-2">
                <Download size={18} />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Entrada
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
                      Carregando clientes...
                    </td>
                  </tr>
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Nenhum cliente encontrado
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => {
                    const plan = getClientPlan(client);
                    const revenue = getClientRevenue(client);
                    return (
                      <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                              {client.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {client.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center text-sm text-gray-700">
                              <Mail size={14} className="mr-2 text-gray-400" />
                              {client.email}
                            </div>
                            {client.phone && (
                              <div className="flex items-center text-sm text-gray-700">
                                <Phone size={14} className="mr-2 text-gray-400" />
                                {client.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${planConfig[plan]?.color || planConfig.basic.color}`}>
                            {planMap[plan] || "Básico"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[client.subscription_status as keyof typeof statusConfig]?.color || statusConfig.active.color}`}>
                            {statusConfig[client.subscription_status as keyof typeof statusConfig]?.label || client.subscription_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          R$ {revenue.toFixed(2)}/mês
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(client.created_at).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver detalhes"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              className="text-gold hover:text-yellow-700 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(client.id)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && clients.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-gray-500">
                Mostrando <span className="font-medium">{clients.length}</span> de{" "}
                <span className="font-medium">{total}</span> clientes
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" className="bg-gold text-black">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
