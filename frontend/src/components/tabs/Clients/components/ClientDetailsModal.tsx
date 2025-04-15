import { useClientPortfolios } from "@/api/queries";
import { LoadingSpinner, Modal } from "@/components/ui";
import { ClientTotals } from "@/api/types";
import { formatMoney, formatPercent } from "@/shared/utils";
import phrases from "@/shared/phrases.json";

interface ClientDetailsModalProps {
  selectedClient: ClientTotals | null;
  setSelectedClient: (client: ClientTotals | null) => void;
}

const SummaryCard = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-md bg-gray-100 p-3">{children}</div>;
};

export const ClientDetailsModal = ({
  selectedClient,
  setSelectedClient,
}: ClientDetailsModalProps) => {
  const { data: portfolios = [], isLoading: isLoadingPortfolios } =
    useClientPortfolios(selectedClient?.client_id ?? null);

  if (!selectedClient) return null;

  return (
    <Modal
      isOpen={!!selectedClient}
      onClose={() => setSelectedClient(null)}
      title={selectedClient?.client_name + " Details"}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold">Portfolios</h4>

          {isLoadingPortfolios ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-col gap-4">
              {portfolios.map((portfolio) => (
                <SummaryCard key={portfolio.portfolio_id}>
                  <p>
                    {phrases.clients.portfolios.portfolioId}:{" "}
                    {portfolio.external_portfolio_id}
                  </p>
                  <p>
                    {phrases.clients.portfolios.aum}:{" "}
                    {formatMoney(portfolio.total_aum_cad)}
                  </p>
                  <p>
                    {phrases.clients.portfolios.fees}:{" "}
                    {formatMoney(portfolio.total_fees_cad)}
                  </p>
                  <p>
                    {phrases.clients.portfolios.feeRate}:{" "}
                    {formatPercent(portfolio.effective_fee_rate)}
                  </p>
                </SummaryCard>
              ))}
              {portfolios.length === 0 && (
                <p className="text-gray-500">
                  No portfolios found for this client.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
