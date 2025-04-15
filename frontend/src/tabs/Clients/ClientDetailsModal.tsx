import { useClientPortfolios } from "@/api/queries";
import { LoadingSpinner, Modal } from "@/components";
import { ClientTotals } from "@/global/types";
import { formatMoney, formatPercent } from "@/shared/utils";

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
                  <p>Portfolio ID: {portfolio.external_portfolio_id}</p>
                  <p>AUM: {formatMoney(portfolio.total_aum_cad)}</p>
                  <p>Fees: {formatMoney(portfolio.total_fees_cad)}</p>
                  <p>Fee Rate: {formatPercent(portfolio.effective_fee_rate)}</p>
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
